// This is a summary of events that have been processed in an update cycle of a game.
// The events in the digest will be sent to the clients.
export function createDigest (output) {
  let events = []

  return {
    add (...event) {
      events.push(event)
    },

    send () {
      events.forEach(event => output.emit(...event))
      events = []
    }
  }
}

export const blobs = []

export function saveBlob (blob) {
  blobs.push(blob)
  return blob
}

export function findBlob (id) {
  const found = blobs.find(blob => blob.id === id)
  if (found) {
    return found
  } else {
    return false
  }
}
