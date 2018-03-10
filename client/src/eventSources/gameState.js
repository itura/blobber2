import openSocket from 'socket.io-client';
import {Subject} from 'rxjs';

function createGameState() {
  const initialize = new Subject();
  const socket = openSocket();

  socket.on('initialize', data => initialize.next(data));

  return {
    initialize() {
      return initialize;
    }
  };
}

export const GameState = createGameState();