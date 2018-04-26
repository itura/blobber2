import { Subject } from 'rxjs/Subject'
import { filter, map } from 'rxjs/operators'

export function createObservableSocket (socket, ...config) {
  let eventTypes = null
  let operators = []

  if (typeof config[0] === 'string') {
    eventTypes = config
  } else if (typeof config[0] === 'object') {
    eventTypes = config[0].eventTypes || []
    operators = config[0].operators || []
  }

  const source$ = new Subject()
  eventTypes.forEach(type => {
    socket.on(type, data => source$.next({type, data}))
  })

  socket.on('error', data => {
    console.log('error!', data)
    socket.close()
  })

  const match = type => source => source.pipe(
    filter(event => event.type === type),
    map(event => event.data)
  )

  const os = {
    on (type, ...operators) {
      return source$.pipe(match(type), ...operators)
    },

    emit (type, data) {
      socket.emit(type, data)
    },

    close () {
      socket.close()
      source$.complete()
    }
  }

  return operators
    .map(
      operator => ({
        [operator.name]: function (type, ...args) {
          return this.on(type, operator(...args))
        }
      })
    )
    .reduce(
      (os, operator) => Object.assign(os, operator),
      os
    )
}
