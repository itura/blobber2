import openSocket from 'socket.io-client';
import {Subject} from 'rxjs';

export function Event(type, data) {
  return {type, data};
}

function createGameState() {
  const bus = new Subject().share();
  const socket = openSocket('/', {
    reconnection: false
  });

  socket.on('error', data => console.log('error!', data));

  const eventTypes = ['initialize', 'move', 'newPlayer', 'grow', 'remove'];
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)));
  });

  function filterBy(type) {
    return bus
      .filter(event => event.type === type)
      .map(event => event.data);
  }

  return {
    get(type, id = null) {
      let source = filterBy(type)
        .do(event => console.log(type, event));

      if (id) {
        source = source.filter(event => event.id === id);
      }

      return source;
    },

    notifyOfMoveEvent(id, location) {
      socket.emit('move', {id, location});
    },

    notify(type, data) {
      console.log('notify', type, data);
      socket.emit(type, data);
    }
  };
}

export const GameState = createGameState();