const {init} = require('./server');

const server = init(console.log);

server.listen(5000, function () {
  console.log('listening on *:5000');
});
