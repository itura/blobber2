import { createVector } from '../../shared/vector'
import { Set } from 'immutable'
import { fromEvent } from 'rxjs/observable/fromEvent'
import { filter, map, merge, sampleTime, tap } from 'rxjs/operators'
import { LockedSubject, unless } from '../../shared/subjects'
import { Subject } from 'rxjs/Subject'

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
  const isTyping$ = LockedSubject()

  fromEvent(window, 'blur').subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown = fromEvent(window, 'keydown').pipe(
    map(event => currentKeyCombo.add(event.keyCode)),
    filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo))
  )

  const keyUp = fromEvent(window, 'keyup').pipe(
    map(event => currentKeyCombo.remove(event.keyCode)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo))
  )

  fromEvent(window, 'keyup').subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode)
  })

  const mouseMove = fromEvent(window, 'mousemove').pipe(
    sampleTime(100),
    map(event => createVector(event.clientX, event.clientY))
  )

  const mouseDown = fromEvent(window, 'mousedown')

  const userInput = {
    mouseMove () {
      return mouseMove
    },

    mouseDown () {
      return mouseDown
    },

    keyPress () {
      return keyDown.pipe(
        merge(keyUp),
        unless(isTyping$)
      )
    },

    startTyping () {
      return isTyping$.pipe(filter(isTyping => isTyping))
    },

    stopTyping () {
      return isTyping$.pipe(filter(isTyping => !isTyping))
    },

    get (keyCombo) {
      return keyDown.pipe(
        filter(event => event.keyCombo().equals(keyCombo)))
    }
  }

  // todo find a better way to do this
  let isTyping = false
  const key$ = new Subject()
  userInput.get(KeyCombos.TYPE).subscribe(event => {
    if (isTyping) {
      key$.next()
    } else {
      isTyping$.lock(key$)
    }
    isTyping = !isTyping
  })

  return userInput
}

export const UserInput = createUserInput()
