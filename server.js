const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let newId = 0;

function createLocation(x, y) {
  return {x, y}
}

const blobs = [];

function createBlob(x, y, size) {
  newId += 1;
  let blob = {id: newId, location: createLocation(x,y), size};
  blobs.push(blob);
  return blob;
}

[1,2,3,4,5].forEach((blob, index) => createBlob(100 * index, 100 * index, 20));

io.on('connection', socket => {
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
