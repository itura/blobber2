const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Observable = require('rxjs').Observable;
let bus;

let newId = 0;

function createLocation(x, y) {
  return {x, y,
    changeBy(dx, dy) {
      return createLocation(x + dx, y + dy);
    }
  };
}

const blobs = [];
[1,2,3,4,5].forEach((_, index) => {
  const blob = createBlob(100 * index, 100 * index, 20)
  Observable.timer(1000, 2000)
    .map(value => ({id: blob.id, location: blob.location.changeBy(value * 10, value * 10)}))
    .subscribe(data => {
      if (bus) {
        bus.notify('move', data)
      }
    });
});

function createBlob(x, y, size) {
  newId += 1;
  let blob = {id: newId, location: createLocation(x,y), size};
  blobs.push(blob);
  return blob;
}


Observable.timer(1000, 2000)
  .subscribe(value => console.log('blobs:', blobs.length, blobs.map(blob => blob.id)));

io.on('connection', socket => {
  bus = {
    notify(type, data) {
      socket.broadcast.emit(type, data);
    },
    subscribeTo(type, fn) {
      socket.on(type, fn);
    }
  };

  const player = createBlob(-100, -100, 100);
  console.log(`User ${player.id} connected.`);

  socket.emit('initialize', {
    id: player.id,
    location: player.location,
    size: player.size,
    title: 'Blobber2',
    blobs: blobs.filter(blob => blob !== player)
  });

  socket.on('move', data => {
    console.log('move!', data);
  });
});

http.listen(5000, function () {
  console.log('listening on *:5000');
});
