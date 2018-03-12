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
  console.log('hi');

  const eventTypes = ['initialize', 'move', 'newPlayer', 'grow'];
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
      let source = filterBy(type);

      if (id) {
        source = source.filter(event => event.id === id);
      }

      return source;
    },

    notifyOfMoveEvent(id, location) {
      socket.emit('move', {id, location});
    },

    notify(type, data) {
      socket.emit(type, data);
    }
  };
}

export const GameState = createGameState();