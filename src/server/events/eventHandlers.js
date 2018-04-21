import { blobs, findBlob } from '../gameState'
import { round } from '../models/vector'

const newPlayer = digest => data => {
  const player = findBlob(data.id)
  digest.add('np', player)
}

const removeHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1)
    digest.add('rv', data)
  }
}

const directionHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blob.direction.x = data.direction.x
    blob.direction.y = data.direction.y
  }
}

const mouseClickHandler = digest => data => {
  // pass
}

const mouseMoveHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blob.lookDir.x = data.direction.x
    blob.lookDir.y = data.direction.y
  }
}

const updateAll = digest => data => {
  blobs.forEach(blob => {
    if ((blob.direction.x != null) || (blob.direction.y != null)) {
      blob.location.x = round(blob.location.x + blob.direction.x * 5, 2)
      blob.location.y = round(blob.location.y + blob.direction.y * 5, 2)
      digest.add('pm', {id: blob.id, location: blob.location})
    }
  })
}

const chat = digest => data => {
  digest.add('ch', data)
}

export const eventHandlers = [
  ['np', newPlayer],
  ['rv', removeHandler],
  ['ud', directionHandler],
  ['mc', mouseClickHandler],
  ['mm', mouseMoveHandler],
  ['updateAll', updateAll], // updateAll is actually just an internal command so we don't need to shorten it unless we want to
  ['ch', chat]
]
