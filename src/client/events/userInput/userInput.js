import { createVector } from '../../../shared/vector'
import { filter, map, sampleTime } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { LockedSubject, ToggleSubject } from '../../../shared/subjects'
import { Keys } from './keys'
import { KeyComboStream } from './keyComboStream'

export function createUserInput (WindowSources) {
  const isTyping$ = ToggleSubject(false)
  const isLocked$ = LockedSubject(false)
  const isDisabled$ = merge(isTyping$, isLocked$)
  const movement$ = KeyComboStream(
    [Keys.W, Keys.A, Keys.S, Keys.D],
    WindowSources.blur$,
    WindowSources.keyDown$,
    WindowSources.keyUp$,
    isDisabled$)

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
    movement$: movement$,

    lock () {
      return isLocked$.lock()
    }
  }
}
