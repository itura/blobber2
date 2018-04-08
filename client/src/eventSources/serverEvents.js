import openSocket from 'socket.io-client'
import { Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

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

  const eventTypes = ['initialize', 'move', 'newPlayer', 'remove', 'chat']
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)))
  })

  return {
    get (type, id = null) {
      let source = bus.pipe(
        filter(event => event.type === type),
        map(event => event.data)
      )

      if (id) {
        source = source.pipe(filter(event => event.id === id))
      }

      return source
    },

    notify (type, data) {
      socket.emit(type, data)
    }
  }
}

export const ServerEvents = createGameState()
