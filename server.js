const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let rs = require('rxjs');
const Observable = rs.Observable;
const Subject = rs.Subject;

// helpers
function createLocation(x, y) {
  return {
    x, y,
    changeBy(dx, dy) {
      return createLocation(x + dx, y + dy);
    }
  };
}


// event bus
function createEventBus(source) {
  return {
    notify(type, data) {
      io.sockets.emit(type, data);
    },
    get(type) {
      return source
        .filter(event => event.type === type)
        .map(event => event.data);
    }
  }
}

const eventSource = new Subject();
const eventBus = createEventBus();
const eventTypes = ['initialize', 'move'];

// initial game state
const blobs = [];
let newId = 0;
function createBlob(x, y, size) {
  newId += 1;
  let blob = {id: newId, location: createLocation(x, y), size};
  blobs.push(blob);
  return blob;
}
[1, 2, 3, 4, 5].forEach((_, index) => {
  const blob = createBlob(100 * index, 100 * index, 20)
  Observable.timer(1000, 2000)
    .map(value => ({id: blob.id, location: blob.location.changeBy(value * 10, value * 10)}))
    .subscribe(data => {
      eventBus.notify('move', data)
    });
});

// server monitoring
Observable.timer(1000, 2000)
  .subscribe(value => console.log('blobs:', blobs.length, blobs.map(blob => blob.id)));

io.on('connection', socket => {
  // create a new player
  const player = createBlob(-100, -100, 100);
  console.log(`User ${player.id} connected.`);

  socket.emit('initialize', {
    id: player.id,
    location: player.location,
    size: player.size,
    title: 'Blobber2',
    blobs: blobs.filter(blob => blob !== player)
  });

  // route events coming in on this socket to the main event bus
  eventTypes.forEach(type => socket.on(type, data => eventSource.next({type, data})));
});

http.listen(5000, function () {
  console.log('listening on *:5000');
});
