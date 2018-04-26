// This is a summary of events that have been processed in an update cycle of a game.
// The events in the digest will be sent to the clients.
export function createDigest (output) {
  let events = []

  return {
    add (event) {
      events.push(event)
    },

    send () {
      events.forEach(event => output.emit(event.type, event.data))
      events = []
    }
  }
}

function createBlobsRepository () {
  const blobs = []

  return {
    find (id) {
      return blobs.find(blob => blob.id === id) || false
    },

    save (blob) {
      blobs.push(blob)
      return blob
    },

    remove (blob) {
      blobs.splice(blobs.indexOf(blob), 1)
    },

    forEach (fn) {
      blobs.forEach(fn)
    },

    all () {
      return blobs
    }
  }
}

export const BlobsRepository = createBlobsRepository()
