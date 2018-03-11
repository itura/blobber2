import openSocket from 'socket.io-client';
import {Subject} from 'rxjs';

function Event(type, data) {
  return {type, data};
}

function createGameState() {
  const bus = new Subject();
  const socket = openSocket();

  const eventTypes = ['initialize', 'move'];
  eventTypes.forEach(type => {
    socket.on(type, data => bus.next(Event(type, data)));
  });

  function filterByType(bus, type) {
    return bus
      .filter(event => event.type === type)
      .map(event => event.data);
  }

  return {
    get: {
      initialize() {
        return filterByType(bus, 'initialize').do(event => console.log(event));
      },

      move() {
        return filterByType(bus, 'move');
      }
    },

    notify: {
      move(id, location) {
        socket.emit('move', {id, location})
      }
    }
  };
}

export const GameState = createGameState();