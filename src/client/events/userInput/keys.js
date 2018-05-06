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

export function KeyCombo (...keys) {
  return Set(keys)
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
