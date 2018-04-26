import openSocket from 'socket.io-client'
import { filter } from 'rxjs/operators'
import { createObservableSocket } from '../../shared/observableSocket'

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
    get (event, id = null) {
      return os.on(event.type, filterByIdIfGiven(id))
    },

    notify (event) {
      os.emit(event.type, event.data)
    }
  }
}

export const ServerEvents = createServerEvents()
