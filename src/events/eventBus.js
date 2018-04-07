const {Subject} = require('rxjs')

// This is a stream of incoming events that need to be processed. The events can originate
// from either the client or the server itself.
function createEventBus () {
  const source = new Subject()

  return {
    get (type) {
      return source
        .filter(event => event.type === type)
        .map(event => event.data)
    },

    put (type, data) {
      source.next({type, data})
    }
  }
}

const eventBus = createEventBus()

module.exports = {
  eventBus
}
