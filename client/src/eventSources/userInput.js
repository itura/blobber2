import {Observable} from 'rxjs';
import {Location} from '../blobs/blob';

function createUserInput() {
    const mouseMove = Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .map(event => Location.create(event.clientX, event.clientY))
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