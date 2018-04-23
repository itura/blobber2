import { blobs, findBlob } from '../gameState'
import { round } from '../../shared/util'
import { Events } from '../../shared/events'

const newPlayer = digest => data => {
  const player = findBlob(data.id)
  digest.add(Events.NEW_PLAYER.with(player))
}

const removeHandler = digest => data => {
  const blob = findBlob(data.id)
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1)
    digest.add(Events.REMOVE_PLAYER.with(data))
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
      digest.add(Events.PLAYER_MOVE.with({
        id: blob.id,
        location: blob.location
      }))
    }
  })
}

const chat = digest => data => {
  digest.add(Events.CHAT.with(data))
}

const setupHandler = (event, handler) => (eventBus, digest) => {
  eventBus.get(event.type).subscribe(handler(digest))
}

export const eventHandlerSetups = [
  setupHandler(Events.NEW_PLAYER, newPlayer),
  setupHandler(Events.REMOVE_PLAYER, removeHandler),
  setupHandler(Events.UPDATE_DIRECTION, directionHandler),
  setupHandler(Events.MOUSE_CLICK, mouseClickHandler),
  setupHandler(Events.MOUSE_MOVE, mouseMoveHandler),
  setupHandler(Events.CHAT, chat),
  setupHandler(Events.UPDATE_ALL, updateAll)
]
