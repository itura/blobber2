/* eslint-env jasmine */
// TODO rewrite in jest
import { createServer } from '../src/server/server'
import openSocket from 'socket.io-client'
import { Observable, Subject } from 'rxjs'

const port = 9001
const clientOptions = {
  reconnection: false
}

function connect () {
  return openSocket(`http://localhost:${port}`, clientOptions)
}

describe('server', () => {
  let serverInstance, client1, client2

  beforeAll(() => {
    const server = createServer(() => null)
    serverInstance = server.listen(port)
  })

  afterAll(() => {
    serverInstance.close()
    client1 = null
    client2 = null
  })

  it('sends an initialize event on connection', done => {
    client1 = connect()
    client1.on('initialize', data => {
      expect(data.id).not.toBeNull()
      expect(data.location).toEqual({x: 100, y: 100})
      expect(data.size).toEqual(100)
      expect(data.title).toEqual('Blobber2 😍😎🤗👌')
      expect(data.blobs).not.toBeNull()

      client1.close()
      done()
    })
  })

  it('broadcasts when a player joins', done => {
    client1 = connect()
    client1.on('initialize', data => {
      client2 = connect()
    })

    client1.on('newPlayer', data => {
      expect(data.id).not.toBeNull()
      expect(data.location).toEqual({x: 100, y: 100})
      expect(data.size).toEqual(100)

      client1.close()
      client2.close()
      done()
    })
  })

  function createObservableSocket (socket, ...eventTypes) {
    const source$ = new Subject()

    eventTypes.forEach(type => {
      socket.on(type, data => source$.next({type, data}))
    })

    const eventsMatching = type => source$.filter(event => event.type === type)
    const unwrap = event => event.data

    return {
      get (type) {
        return eventsMatching(type)
          .map(unwrap)
      },

      first (type) {
        return eventsMatching(type)
          .first()
          .map(unwrap)
      },

      close () {
        socket.close()
      }
    }
  }

  it('broadcasts when a player leaves', done => {
    let client1Id = null

    client1 = createObservableSocket(connect(), 'initialize')
    client2 = createObservableSocket(connect(), 'initialize', 'remove')

    Observable.forkJoin(client1.first('initialize'), client2.first('initialize'))
      .subscribe(() => client1.close())

    client1.get('initialize').subscribe(data => {
      client1Id = data.id
    })

    client2.get('remove').subscribe(data => {
      if (data.id === client1Id) {
        client2.close()
        done()
      }
    })
  })

  it('broadcasts player move events', done => {
    const found$ = new Subject()
    found$.subscribe(data => {
      expect(data.location).toEqual(newLocation)

      client1.close()
      client2.close()
      done()
    })

    let client1Id
    const newLocation = {x: 500, y: 400}

    client1 = connect()
    client1.on('initialize', data => {
      client1Id = data.id
      client1.emit('move', {
        id: data.id,
        location: newLocation
      })
    })

    client2 = connect()
    client2.on('move', data => {
      if (data.id === client1Id) {
        found$.next(data)
      }
    })
  })
})
