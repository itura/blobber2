const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rx = require('rxjs');
const Observable = rx.Observable;

const {eventBus} = require('./events/eventBus');
const {createBlob} = require('./models/blob');
const {createDigest, blobs, saveBlob} = require('./gameState');
const {eventHandlers} = require('./events/eventHandlers');

function init(log) {
// Establish update loop
  const digest = createDigest(io.sockets);
  Observable.timer(0, 100).subscribe(() => {
    digest.send();
  });

// Set up handlers to consume events from the bus and update the digest
  eventHandlers.forEach(([name, handler]) => {
    eventBus.get(name).subscribe(handler(digest));
  });

// We will process these events when a client sends them
  const clientEvents = ['move', 'grow'];

// debug monitoring
  Observable.timer(1000, 2000)
    .subscribe(value => log('blobs:', blobs.length, blobs.map(blob => blob.id)));

// configure websockets
  io.on('connection', socket => {
    socket.on('disconnect', () => {
      log(`User ${player.id} disconnected.`);
      eventBus.put('remove', {
        id: player.id
      });
    });

    // create a new player
    const player = saveBlob(createBlob(100, 100, 100));
    log(`User ${player.id} connected.`);

    // initialize the client
    socket.emit('initialize', {
      id: player.id,
      location: player.location,
      size: player.size,
      title: 'Blobber2 😍😎🤗👌',
      blobs: blobs
    });

    // route known events coming in on this socket to the main event bus
    clientEvents.forEach(type => socket.on(type, data => {
      eventBus.put(type, data);
    }));

    // let the world know what just happened!
    eventBus.put('newPlayer', player);
  });

// Some error handling. It's unlikely that these will occur but when they do we want
// to know about it.
  io.on('connect_error', data => {
    log('connect error!', data);
  });

  io.on('connect_timeout', () => {
    log('connect timeout!');
  });

  io.on('error', data => {
    log('error!', data);
  });

  return server;
}

module.exports = {
  init
};
