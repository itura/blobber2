import { createVector } from '../../shared/vector'

let newId = 0

// blob model
export function createBlob (x, y, size) {
  newId += 1

  return {
    id: newId,
    location: createVector(x, y),
    direction: createVector(0, 0),
    lookDir: createVector(0, 0),
    size
  }
}
