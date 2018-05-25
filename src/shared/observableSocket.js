import { filter, map } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'

export function createObservableSocket (socket, ...config) {
  let eventTypes = null
  let operators = []

  if (typeof config[0] === 'string') {
    eventTypes = config
  } else if (typeof config[0] === 'object') {
    eventTypes = config[0].eventTypes || []
    operators = config[0].operators || []
  }

  const source$ = new Observable(observer => {
    eventTypes.forEach(type => {
      socket.on(type, data => observer.next({type, data}))
    })

    socket.on('error', data => {
      observer.error(data)
      socket.close()
    })

    return () => {
      socket.close()
    }
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
