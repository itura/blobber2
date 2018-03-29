import {Observable} from 'rxjs';
import {Location} from '../blobs/blob';
import {Set} from "immutable";

export const Keys = {
  SPACE: 32,
  SHIFT: 16,
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
};

export const Directions = {
  87: {x:0, y:-1},
  83: {x:0, y:1},
  68: {x:1, y:0},
  65: {x:-1, y:0}
};

export function KeyCombo(...keys) {
  return Set(keys);
}

function KeyPressEvent(keyCombo) {
  return {
    keyCombo() {
      return keyCombo;
    }
  }
}

function createUserInput() {
  let currentKeyCombo = KeyCombo();

  const keyDown = Observable.fromEvent(window, 'keydown')
    .map(event => currentKeyCombo.add(event.keyCode))
    .filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo))
    .do(newKeyCombo => currentKeyCombo = newKeyCombo)
    .map(newKeyCombo => KeyPressEvent(newKeyCombo))
    .share();

  const keyUp = Observable.fromEvent(window, 'keyup')
    .map(event => currentKeyCombo.remove(event.keyCode))
    .do(newKeyCombo => currentKeyCombo = newKeyCombo)
    .map(newKeyCombo => KeyPressEvent(newKeyCombo))
    .share();

  Observable.fromEvent(window, 'keyup').subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode);
  });

  const mouseMove = Observable.fromEvent(window, 'mousemove')
    .sampleTime(100)
    .map(event => Location.create(event.clientX, event.clientY))
    .share();

  const mouseDown = Observable.fromEvent(window, 'mousedown')
    .share();

  return {
    mouseMove() {
      return mouseMove;
    },

    mouseDown() {
      return mouseDown;
    },

    keyDown() {
      return keyDown;
    },

    keyUp() {
      return keyUp;
    },

    get(keyCombo) {
      return keyDown
        .filter(event => event.keyCombo().equals(keyCombo))
    }
  }
}

export const UserInput = createUserInput();