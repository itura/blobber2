const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let rx = require('rxjs');
const Observable = rx.Observable;
const Subject = rx.Subject;

// helpers
function createLocation(x, y) {
  return {
    x, y,
    changeBy(dx, dy) {
      return createLocation(x + dx, y + dy);
    }
  };
}

function createDigest() {
  let events = [];
  return {
    add(...event) {
      events.push(event);
    },

    send() {
      events.forEach(event => io.sockets.emit(...event));
      events = [];
    }
  }
}
const digest = createDigest();
Observable.timer(0, 100).subscribe(value => {
  digest.send();
});



let newId = 0;
function createBlob(x, y, size) {
  newId += 1;
  let blob = {id: newId, location: createLocation(x, y), size};
  blobs.push(blob);
  return blob;
}


// event bus
function createEventBus(source) {
  return {
    get(type) {
      return source
        .filter(event => event.type === type)
        .map(event => event.data);
    }
  }
}

let blobs = [];
const eventSource = new Subject().share();
const eventBus = createEventBus(eventSource);
const eventTypes = ['initialize', 'move', 'newPlayer', 'grow'];

// initial game state
// [1, 2, 3, 4, 5].forEach((_, index) => {
//   const blob = createBlob(100 * index, 100 * index, 20);
//   Observable.timer(1000, 2000)
//     .map(value => ({id: blob.id, location: blob.location.changeBy(value * 10, value * 10)}))
//     .subscribe(data => {
//       blob.location = data.location;
//       blob.size += 10;
//       digest.add('move', data);
//       digest.add('grow', {id: blob.id, size: blob.size + 10});
//     });
// });

// handlers for game events
eventBus.get('move').subscribe(data => {
  console.log('handling move', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.location = data.location;
    digest.add('move', data);
  }
});

eventBus.get('grow').subscribe(data => {
  console.log('handling grow', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.size += 10;
    digest.add('grow', {id: blob.id, size: blob.size});
  }
});

eventBus.get('remove').subscribe(data => {
  console.log('handling remove', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1);
  }
  digest.add('remove', data);
});

// debug monitoring
Observable.timer(1000, 2000)
  .subscribe(value => console.log('blobs:', blobs.length, blobs.map(blob => blob.id)));

io.on('connection', socket => {
  // create a new player
  const player = createBlob(100, 100, 100);
  console.log(`User ${player.id} connected.`);

  socket.emit('initialize', {
    id: player.id,
    location: player.location,
    size: player.size,
    title: 'Blobber2',
    blobs: blobs
  });

  socket.on('disconnect', () => {
    console.log(`User ${player.id} disconnected.`);
    eventSource.next({type: 'remove', data: {id: player.id}})
  });

  // route events coming in on this socket to the main event bus
  eventTypes.forEach(type => socket.on(type, data => {
    console.log(type, data);
    eventSource.next({type, data})
  }));

  // let the world know what just happened!
  digest.add('newPlayer', player)
});

http.listen(5000, function () {
  console.log('listening on *:5000');
});
