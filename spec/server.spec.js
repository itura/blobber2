const {server} = require('../src/server');
const openSocket = require('socket.io-client');
const {Observable, Subject} = require('rxjs');

const port = 9001;
const clientOptions = {
  reconnection: false
};

function connect() {
  return openSocket(`http://localhost:${port}`, clientOptions);
}

describe('server', () => {
  let serverInstance, client1, client2;

  beforeAll(() => {
    serverInstance = server.listen(port, () => console.log('Server Started\n-----'));
  });

  afterAll(() => {
    serverInstance.close(() => console.log('-----\nServer closed\n\n'));
  });

  it('sends an initialize event on connection', done => {
    client1 = connect();
    client1.on('initialize', data => {
      expect(data.id).not.toBeNull();
      expect(data.location).toEqual({x: 100, y: 100});
      expect(data.size).toEqual(100);
      expect(data.title).toEqual('Blobber2 😍😎🤗👌');
      expect(data.blobs).not.toBeNull();

      client1.close();
      done();
    });
  });

  it('broadcasts when a player joins', done => {
    client1 = connect();
    client1.on('initialize', data => {
      client2 = connect();
    });

    client1.on('newPlayer', data => {
      expect(data.id).not.toBeNull();
      expect(data.location).toEqual({x: 100, y: 100});
      expect(data.size).toEqual(100);

      client1.close();
      client2.close();
      done();
    });
  });

  it('broadcasts when a player leaves', done => {
    const client1Initialized$ = new Subject();
    const client2Initialized$ = new Subject();

    Observable.forkJoin(client1Initialized$.take(1), client2Initialized$.take(1))
      .subscribe(() => {
        client1.close();
      });

    let client1Id = null;

    client1 = connect();
    client1.on('initialize', data => {
      client1Id = data.id;
      client1Initialized$.next(true);
    });

    client2 = connect();
    client2.on('initialize', data => {
      client2Initialized$.next(true);
    });
    client2.on('remove', data => {
      if (data.id === client1Id) {
        client2.close();
        done();
      }
    });
  });

  it('broadcasts player move events', done => {
    const found$ = new Subject();
    found$.subscribe(data => {
      expect(data.location).toEqual(newLocation);

      client1.close();
      client2.close();
      done();
    });

    let client1Id;
    const newLocation = {x: 500, y: 400};

    client1 = connect();
    client1.on('initialize', data => {
      client1Id = data.id;
      client1.emit('move', {
        id: data.id,
        location: newLocation
      });
    });

    client2 = connect();
    client2.on('move', data => {
      if (data.id === client1Id) {
        found$.next(data);
      }
    });
  });
});
