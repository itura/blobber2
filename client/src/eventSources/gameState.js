import openSocket from 'socket.io-client'
import { Subject } from 'rxjs'

export function Event (type, data) {
  return {type, data}
}

function createGameState () {
  const bus = new Subject()
  const socket = openSocket('http://localhost:5000/', {
    reconnection: false
  })

  socket.on('error', data => {
    console.log('error!', data)
    socket.disconnect()
  })

  const eventTypes = ['initialize', 'move', 'newPlayer', 'remove']
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)))
  })

  function filterBy (type) {
    return bus
      .filter(event => event.type === type)
      .map(event => event.data)
  }

  return {
    get (type, id = null) {
      let source = filterBy(type)

      if (id) {
        source = source.filter(event => event.id === id)
      }

      return source
    },

    notify (type, data) {
      socket.emit(type, data)
    }
  }
}

export const GameState = createGameState()
