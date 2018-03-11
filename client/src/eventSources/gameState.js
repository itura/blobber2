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

  const eventTypes = ['initialize', 'move', 'newPlayer'];
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)));
  });

  function filterBy(type) {
    return bus
      .filter(event => event.type === type)
      .map(event => event.data);
  }

  return {
    getMoveEvents(id) {
      return filterBy('move')
        .filter(event => event.id === id)
        .map(event => event.location)
    },

    get(type) {
      return filterBy(type);
    },

    notifyOfMoveEvent(id, location) {
      socket.emit('move', {id, location});
    }
  };
}

export const GameState = createGameState();