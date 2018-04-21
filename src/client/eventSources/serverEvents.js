import openSocket from 'socket.io-client'
import { Subject } from 'rxjs/Subject'
import { filter, map } from 'rxjs/operators'

export function Event (type, data) {
  return {type, data}
}

function createServerEvents () {
  const bus$ = new Subject()
  const socket = openSocket('http://localhost:5000/', {
    reconnection: false
  })

  socket.on('error', data => {
    console.log('error!', data)
    socket.disconnect()
  })

  const eventTypes = ['init', 'pm', 'np', 'rv', 'ch']
  eventTypes.forEach(type => {
    socket.on(type, data => bus$.next(Event(type, data)))
  })

  const filterByIdIfGiven = id => source$ => id
    ? source$.pipe(filter(event => event.id === id))
    : source$

  return {
    get (type, id = null) {
      return bus$.pipe(
        filter(event => event.type === type),
        map(event => event.data),
        filterByIdIfGiven(id)
      )
    },

    notify (type, data) {
      socket.emit(type, data)
    }
  }
}

export const ServerEvents = createServerEvents()
