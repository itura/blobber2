const {blobs} = require('../gameState');
const {createBlob, follow} = require('../models/blob');
const {saveBlob} = require('../gameState');

const newPlayer = digest => data => {
  const player = blobs.find(blob => blob.id === data.id);
  digest.add('newPlayer', player);
};

const removeHandler = digest => data => {
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1);
    digest.add('remove', data);
  }
};

const directionHandler = digest => data => {
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.direction.x = blob.direction.x + data.direction.x;
    blob.direction.y = blob.direction.y + data.direction.y;
    data.message = blob.direction;
    //digest.add('msg', data);
  }
};

const keyHandler = digest => data => {
  blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    console.log(data.keyEvent);
  };
};

const mouseHandler = digest => data => {
  //pass
};

const eventHandlers = [
  ['newPlayer', newPlayer],
  ['remove', removeHandler],
  ['updateDirection', directionHandler],
  ['keyEvent', keyHandler],
  ['mouseClick', mouseHandler]
];

module.exports = {
  eventHandlers
};