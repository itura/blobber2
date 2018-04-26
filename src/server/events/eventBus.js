import { Subject } from 'rxjs/Subject'
import { filter, map } from 'rxjs/operators'

// This is a stream of incoming events that need to be processed. The events can originate
// from either the client or the server itself.
function createEventBus () {
  const source$ = new Subject()

  return {
    get (event) {
      return source$.pipe(
        filter(_event => _event.type === event.type),
        map(_event => _event.data)
      )
    },

    put (event) {
      source$.next(event)
    }
  }
}

export const eventBus = createEventBus()
