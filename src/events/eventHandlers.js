const {blobs} = require('../gameState');
const {createBlob, follow} = require('../models/blob');
const {saveBlob} = require('../gameState');

const moveHandler = digest => data => {
  // console.log('handling move', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.location = data.location;
    digest.add('move', data);
  }
};

const growHandler = digest => data => {
  // console.log('handling grow', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.size += 10;
    digest.add('grow', {id: blob.id, size: blob.size});
  }
};

const removeHandler = digest => data => {
  // console.log('handling remove', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1);
    digest.add('remove', data);
  }
};

const newPlayer = digest => data => {
  // console.log('handling newPlayer', data);
  const player = blobs.find(blob => blob.id === data.id);
  digest.add('newPlayer', player);
};

const eventHandlers = [
  ['move', moveHandler],
  ['grow', growHandler],
  ['remove', removeHandler],
  ['newPlayer', newPlayer]
];

module.exports = {
  eventHandlers
};