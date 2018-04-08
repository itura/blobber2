import { Vector } from '../blobs/blob'
import { Set } from 'immutable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { filter, map, merge, sampleTime, share, tap, withLatestFrom } from 'rxjs/operators'

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
  let isTyping = false
  const isTyping$ = new BehaviorSubject(false)

  fromEvent(window, 'blur').subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown$ = fromEvent(window, 'keydown').pipe(
    map(event => currentKeyCombo.add(event.keyCode)),
    filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
    share())

  const keyUp$ = fromEvent(window, 'keyup').pipe(
    map(event => currentKeyCombo.remove(event.keyCode)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
    share())

  fromEvent(window, 'keyup').subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode)
  })

  const mouseMove$ = fromEvent(window, 'mousemove').pipe(
    sampleTime(100),
    map(event => Vector.create(event.clientX, event.clientY)),
    share())

  const mouseDown$ = fromEvent(window, 'mousedown').pipe(
    share())

  const toggle = toggle$ => source$ => source$.pipe(
    withLatestFrom(toggle$),
    filter(([event, enabled]) => !enabled),
    map(([event, enabled]) => event)
  )

  const userInput = {
    mouseMove () {
      return mouseMove$
    },

    mouseDown () {
      return mouseDown$
    },

    isTyping () {
      return isTyping$
    },

    keyPress () {
      return keyDown$.pipe(
        merge(keyUp$),
        toggle(isTyping$)
      )
    },

    get (keyCombo) {
      return keyDown$
        .filter(event => event.keyCombo().equals(keyCombo))
    }
  }

  // todo find a better way to do this
  userInput.get(KeyCombos.TYPE).subscribe(event => {
    isTyping = !isTyping
    isTyping$.next(isTyping)
  })

  return userInput
}

export const UserInput = createUserInput()
