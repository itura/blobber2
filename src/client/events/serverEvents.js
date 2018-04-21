import openSocket from 'socket.io-client'
import { filter } from 'rxjs/operators'
import { createObservableSocket } from '../../shared/observableSocket'

export function Event (type, data) {
  return {type, data}
}

const filterByIdIfGiven = id => source$ => id
  ? source$.pipe(filter(event => event.id === id))
  : source$

function createServerEvents () {
  const socket = openSocket('http://localhost:5000/', {
    reconnection: false
  })

  const os = createObservableSocket(socket, {
    eventTypes: ['init', 'pm', 'np', 'rv', 'ch']
  })

  return {
    get (type, id = null) {
      return os.on(type, filterByIdIfGiven(id))
    },

    notify (type, data) {
      os.emit(type, data)
    }
  }
}

export const ServerEvents = createServerEvents()
