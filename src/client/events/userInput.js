import { createVector } from '../../shared/vector'
import { Set } from 'immutable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { merge } from 'rxjs/observable/merge'
import { filter, map, sampleTime, share, tap } from 'rxjs/operators'
import { LockedSubject, ToggleSubject, unless } from '../../shared/subjects'

export const Keys = {
  SPACE: 32,
  SHIFT: 16,
  ENTER: 13,
  CONTROL: 17,
  ALT: 18,
  SUPER: 91,
  ESCAPE: 27,
  A: 65,
  W: 87,
  S: 83,
  D: 68,
  I: 73,
  C: 67,
  M: 77
}

export const KeyCombos = {
  TYPE: KeyCombo(Keys.ENTER)
}

export const Directions = {
  87: {x: 0, y: -1},
  83: {x: 0, y: 1},
  68: {x: 1, y: 0},
  65: {x: -1, y: 0}
}

export function KeyCombo (...keys) {
  return Set(keys)
}

function KeyPressEvent (keyCombo) {
  return {
    keyCombo () {
      return keyCombo
    }
  }
}

function createUserInput () {
  let currentKeyCombo = KeyCombo()
  const isTyping$ = ToggleSubject(false)
  const isLocked$ = LockedSubject()
  isTyping$.subscribe(isLocked$.observer())

  fromEvent(window, 'blur').subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown$ = fromEvent(window, 'keydown').pipe(
    map(event => currentKeyCombo.add(event.keyCode)),
    filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
    share()
  )

  const keyUp$ = fromEvent(window, 'keyup').pipe(
    map(event => currentKeyCombo.remove(event.keyCode)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
    share()
  )

  fromEvent(window, 'keyup').subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode)
  })

  const mouseMove$ = fromEvent(window, 'mousemove').pipe(
    sampleTime(100),
    map(event => createVector(event.clientX, event.clientY))
  )

  const mouseDown$ = fromEvent(window, 'mousedown')

  const userInput = {
    isTyping$: isTyping$,

    mouseMove () {
      return mouseMove$
    },

    mouseDown () {
      return mouseDown$
    },

    keyPress () {
      return merge(keyDown$, keyUp$).pipe(unless(isLocked$))
    }
  }

  keyDown$
    .pipe(filter(event => event.keyCombo().equals(KeyCombos.TYPE)))
    .subscribe(isTyping$)

  return userInput
}

export const UserInput = createUserInput()
