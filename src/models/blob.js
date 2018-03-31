const {createLocation, createDirection} = require('./position');
const {Observable} = require('rxjs');
const {eventBus} = require('../events/eventBus');

let newId = 0;

// blob model
function createBlob(x, y, size) {
  newId += 1;

  return {
    id: newId,
    location: createLocation(x, y), 
    direction: createDirection(0, 0),
    lookDir: createDirection(0, 0),
    size
  };
}

// blob behaviors

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function hover(blob) {
  Observable.timer(0, 300).subscribe(() => {
    eventBus.put('move', {
      id: blob.id,
      location: blob.location.changeBy(getRandomInt(10) - 5, getRandomInt(10) - 5)
    });
  });
  return blob;
}

function follow(follower, leader) {
  Observable.timer(0, 300).subscribe(() => {
    const dx = (leader.location.x - follower.location.x) / 5;
    const dy = (leader.location.y - follower.location.y) / 5;
    eventBus.put('move', {
      id: follower.id,
      location: follower.location.changeBy(dx, dy)
    });
  });

  return follower;
}

module.exports = {
  createBlob,
  hover,
  follow
};