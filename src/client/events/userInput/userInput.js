import { createVector } from '../../../shared/vector'
import { filter, map, sampleTime } from 'rxjs/operators'
import { ToggleSubject } from '../../../shared/subjects'
import { Keys } from './keys'
import { KeyComboStream } from './keyComboStream'

export function createUserInput (WindowSources) {
  const isTyping$ = ToggleSubject(false)
  const movement$ = KeyComboStream(
    [Keys.W, Keys.A, Keys.S, Keys.D],
    WindowSources.blur$,
    WindowSources.keyDown$,
    WindowSources.keyUp$,
    [isTyping$])

  WindowSources.keyDown$
    .pipe(filter(event => event.keyCode === Keys.ENTER))
    .subscribe(isTyping$)

  const mouseMove$ = WindowSources.mouseMove$
    .pipe(
      sampleTime(100),
      map(event => createVector(event.clientX, event.clientY)))

  const mouseDown$ = WindowSources.mouseDown$

  return {
    isTyping$: isTyping$,
    mouseMove$: mouseMove$,
    mouseDown$: mouseDown$,
    movement$: movement$
  }
}
