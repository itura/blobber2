const {blobs} = require('../gameState')
const {createBlob, follow} = require('../models/blob')
const {saveBlob, findBlob} = require('../gameState')

const newPlayer = digest => data => {
  const player = findBlob(data.id)
  digest.add('newPlayer', player)
}

const removeHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1)
    digest.add('remove', data)
  }
}

const directionHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blob.direction.x = data.direction.x
    blob.direction.y = data.direction.y
  }
}

const keyHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    console.log(data.keyEvent)
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

const update = digest => data => {
  blobs.forEach(blob => {
    blob.location.x = blob.location.x + blob.direction.x * 5
    blob.location.y = blob.location.y + blob.direction.y * 5
    digest.add('move', {id: blob.id, location: blob.location})
  })
}

const eventHandlers = [
  ['newPlayer', newPlayer],
  ['remove', removeHandler],
  ['updateDirection', directionHandler],
  ['mouseClick', mouseClickHandler],
  ['mouseMove', mouseMoveHandler],
  ['updateAll', update]
]

module.exports = {
  eventHandlers
}
