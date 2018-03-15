const {hover, slowGrow, createBlob} = require('./models/blob');

// This is a summary of events that have been processed in an update cycle of a game.
// The events in the digest will be sent to the clients.
function createDigest(output) {
  let events = [];

  return {
    add(...event) {
      events.push(event);
    },

    send() {
      events.forEach(event => output.emit(...event));
      events = [];
    }
  }
}

const blobs = [];

function saveBlob(blob) {
  blobs.push(blob);
  return blob;
}

// initial game state
saveBlob(
  hover(createBlob(100, 100, 20)));
saveBlob(
  hover(createBlob(200, 100, 30)));
saveBlob(
  hover(createBlob(300, 100, 20)));
saveBlob(
  slowGrow(hover(createBlob(400, 100, 40))));
saveBlob(
  hover(createBlob(500, 100, 20)));
saveBlob(
  hover(createBlob(600, 100, 50)));
saveBlob(
  hover(createBlob(100, 200, 20)));
saveBlob(
  hover(createBlob(200, 200, 30)));
saveBlob(
  slowGrow(hover(createBlob(300, 200, 10))));
saveBlob(
  hover(createBlob(400, 200, 40)));
saveBlob(
  hover(createBlob(500, 200, 20)));
saveBlob(
  hover(createBlob(600, 200, 50)));


module.exports = {
  createDigest,
  blobs,
  saveBlob
};
