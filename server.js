const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let rx = require('rxjs');
const Observable = rx.Observable;
const Subject = rx.Subject;

// helpers
function createLocation(x, y) {
  return {
    x, y,
    changeBy(dx, dy) {
      return createLocation(this.x + dx, this.y + dy);
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
const eventSource = new Subject();
const eventBus = createEventBus(eventSource);
const eventTypes = ['initialize', 'move', 'newPlayer', 'grow'];

// initial game state
hover(createBlob(100, 100, 20));
hover(createBlob(200, 100, 30));
hover(createBlob(300, 100, 20));
slowGrow(hover(createBlob(400, 100, 40)));
hover(createBlob(500, 100, 20));
hover(createBlob(600, 100, 50));
hover(createBlob(100, 200, 20));
hover(createBlob(200, 200, 30));
slowGrow(hover(createBlob(300, 200, 10)));
hover(createBlob(400, 200, 40));
hover(createBlob(500, 200, 20));
hover(createBlob(600, 200, 50));


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function slowGrow(blob) {
  Observable.timer(1000, 3000).subscribe(() => {
    eventSource.next({type: 'grow', data: {id: blob.id}});
  });
  return blob;
}

function hover(blob) {
  Observable.timer(0, 300).subscribe(() => {
    eventSource.next({
      type: 'move',
      data: {
        id: blob.id,
        location: blob.location.changeBy(getRandomInt(10) - 5, getRandomInt(10) - 5)
      }
    });
  });
  return blob;
}

function follow(follower, leader) {
  Observable.timer(0, 300).subscribe(() => {
    const dx = (leader.location.x - follower.location.x) / 5;
    const dy = (leader.location.y - follower.location.y) / 5;
    eventSource.next({
      type: 'move',
      data: {
        id: follower.id,
        location: follower.location.changeBy(dx, dy)
      }
    });
  });

  return follower;
}

// handlers for game events
eventBus.get('move').subscribe(data => {
  // console.log('handling move', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.location = data.location;
    digest.add('move', data);
  }
});

eventBus.get('grow').subscribe(data => {
  // console.log('handling grow', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blob.size += 10;
    digest.add('grow', {id: blob.id, size: blob.size});
  }
});

eventBus.get('remove').subscribe(data => {
  // console.log('handling remove', data);
  const blob = blobs.find(blob => blob.id === data.id);
  if (blob) {
    blobs.splice(blobs.indexOf(blob), 1);
  }
  digest.add('remove', data);
});

eventBus.get('newPlayer').subscribe(data => {
  // console.log('handling newPlayer', data);
  const player = blobs.find(blob => blob.id === data.id);
  const follower = follow(createBlob(500, 500, 50), player);
  digest.add('newPlayer', follower);
});

// debug monitoring
Observable.timer(1000, 2000)
  .subscribe(value => console.log('blobs:', blobs.length, blobs.map(blob => blob.id)));

io.on('connect_error', data => {
  console.log('connect error!', data);
});

io.on('connect_timeout', () => {
  console.log('connect timeout!');
});

io.on('error', data => {
  console.log('error!', data);
});

io.on('connection', socket => {
  socket.on('disconnect', () => {
    console.log(`User ${player.id} disconnected.`);
    eventSource.next({type: 'remove', data: {id: player.id}})
  });

  // create a new player
  const player = createBlob(100, 100, 100);
  console.log(`User ${player.id} connected.`);

  socket.emit('initialize', {
    id: player.id,
    location: player.location,
    size: player.size,
    title: 'Blobber2 😍😎🤗👌',
    blobs: blobs
  });

  // route events coming in on this socket to the main event bus
  eventTypes.forEach(type => socket.on(type, data => {
    eventSource.next({type, data})
  }));

  // let the world know what just happened!
  digest.add('newPlayer', player);
  eventSource.next({type: 'newPlayer', data: player});
});

server.listen(5000, function () {
  console.log('listening on *:5000');
});
