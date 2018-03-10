const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('a user connected');
  socket.emit('initialize', {
    location: {x: -100, y: -100},
    title: 'Blobber2',
    size: 100
  });

  socket.on('click', data => {
    console.log('click!');
  });
});

http.listen(5000, function () {
  console.log('listening on *:5000');
});
