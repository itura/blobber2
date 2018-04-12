import { Observable } from 'rxjs'
import { Subject } from 'rxjs/Subject'
import { Vector } from '../blobs/blob'
import { Set } from 'immutable'

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
  const isTyping$ = new Subject()

  Observable.fromEvent(window, 'blur').subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown = Observable.fromEvent(window, 'keydown')
    .map(event => currentKeyCombo.add(event.keyCode))
    .filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo))
    .do(newKeyCombo => { currentKeyCombo = newKeyCombo })
    .map(newKeyCombo => KeyPressEvent(newKeyCombo))
    .share()

  const keyUp = Observable.fromEvent(window, 'keyup')
    .map(event => currentKeyCombo.remove(event.keyCode))
    .do(newKeyCombo => { currentKeyCombo = newKeyCombo })
    .map(newKeyCombo => KeyPressEvent(newKeyCombo))
    .share()

  Observable.fromEvent(window, 'keyup').subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode)
  })

  const mouseMove = Observable.fromEvent(window, 'mousemove')
    .sampleTime(100)
    .map(event => Vector.create(event.clientX, event.clientY))
    .share()

  const mouseDown = Observable.fromEvent(window, 'mousedown')
    .share()

  const userInput = {
    mouseMove () {
      return mouseMove
    },

    mouseDown () {
      return mouseDown
    },

    keyPress () {
      return keyDown.merge(keyUp).filter(() => !isTyping)
    },

    startTyping () {
      return isTyping$.filter(isTyping => isTyping)
    },

    stopTyping () {
      return isTyping$.filter(isTyping => !isTyping)
    },

    get (keyCombo) {
      return keyDown
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
