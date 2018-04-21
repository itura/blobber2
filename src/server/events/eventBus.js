import { Subject } from 'rxjs/Subject'
import { filter, map } from 'rxjs/operators'

// This is a stream of incoming events that need to be processed. The events can originate
// from either the client or the server itself.
function createEventBus () {
  const source$ = new Subject()

  return {
    get (type) {
      return source$.pipe(
        filter(event => event.type === type),
        map(event => event.data)
      )
    },

    put (type, data) {
      source$.next({type, data})
    }
  }
}

export const eventBus = createEventBus()
