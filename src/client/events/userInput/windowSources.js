import { fromEvent } from 'rxjs/observable/fromEvent'

export const WindowSources = {
  keyDown$: fromEvent(window, 'keydown'),
  keyUp$: fromEvent(window, 'keyup'),
  blur$: fromEvent(window, 'blur'),
  mouseMove$: fromEvent(window, 'mousemove'),
  mouseDown$: fromEvent(window, 'mousedown')
}
