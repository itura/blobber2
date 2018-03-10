import {Observable} from 'rxjs';

function createUserInput() {
    const mouseMove = Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .share();

    const mouseDown = Observable.fromEvent(window, 'mousedown')
      .share();

    return {
      mouseMove() {
        return mouseMove;
      },
      mouseDown() {
        return mouseDown;
      }
    }
}

export const UserInput = createUserInput();