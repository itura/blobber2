import openSocket from 'socket.io-client';
import {Subject} from 'rxjs';

export function Event(type, data) {
  return {type, data};
}

function createGameState() {
  const bus = new Subject();
  const socket = openSocket();

  const eventTypes = ['initialize', 'move'];
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)));
  });

  function filterBy(type) {
    return bus
      .filter(event => event.type === type)
      .map(event => event.data);
  }

  return {

    getInitializeEvents() {
      return filterBy('initialize');
    },

    getMoveEvents(id) {
      return filterBy('move')
        .filter(event => event.id === id)
        .map(event => event.location)
    },

    notifyOfMoveEvent(id, location) {
      socket.emit('move', {id, location});
    }
  };
}

export const GameState = createGameState();