const {server} = require('../src/server');
const openSocket = require('socket.io-client');

const port = 9001;
const clientOptions = {
  reconnection: false
};

function connect() {
  return openSocket(`http://localhost:${port}`, clientOptions);
}

describe('server', () => {
  let serverInstance, client1, client2;

  beforeEach(() => {
    serverInstance = server.listen(port, () => console.log(`Listening on ${port}`));
  });

  afterEach(() => {
    serverInstance.close();
  });

  it('sends an initialize event on connection', done => {
    client1 = connect();

    client1.on('initialize', data => {
      expect(data.id).not.toBeNull();
      expect(data.location).toEqual({x: 100, y: 100});
      expect(data.size).toEqual(100);
      expect(data.title).toEqual('Blobber2 😍😎🤗👌');
      expect(data.blobs).not.toBeNull();

      client1.disconnect();
      done();
    });
  });

  it('notifies existing players when a player joins', done => {
    client1 = connect();
    client1.on('initialize', data => {
      client2 = connect();
    });

    client1.on('newPlayer', data => {
      expect(data.id).not.toBeNull();
      expect(data.location).toEqual({x: 100, y: 100});
      expect(data.size).toEqual(100);

      client1.disconnect();
      client2.disconnect();
      done();
    });
  });

  it('notifies existing players when a player leaves', done => {
    let client1Id;

    client1 = connect();
    client1.on('initialize', data => {
      client1Id = data.id;
      client1.disconnect();
    });

    client2 = connect();
    client2.on('remove', data => {
      expect(data.id).toEqual(client1Id);

      client2.disconnect();
      done();
    });
  });
});
