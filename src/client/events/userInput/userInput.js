import { createVector } from '../../../shared/vector'
import { filter, map, sampleTime, share, startWith, tap } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { LockedSubject } from '../../../shared/subjects'
import { Keys } from './keys'
import { KeyComboStream } from './keyComboStream'

function ToggleStream (source$, initial = true) {
  let enabled = !initial

  return source$.pipe(
    startWith(enabled),
    tap(() => {
      enabled = !enabled
    }),
    map(() => enabled),
    share()
  )
}

export function createUserInput (WindowSources) {
  const enterKey = WindowSources.keyDown$.pipe(
    filter(event => event.keyCode === Keys.ENTER),
    share())
  const isTyping$ = ToggleStream(enterKey, false)
  const isLocked$ = LockedSubject(false)
  const isDisabled$ = merge(isTyping$, isLocked$)
  const movement$ = KeyComboStream(
    [Keys.W, Keys.A, Keys.S, Keys.D],
    WindowSources.blur$,
    WindowSources.keyDown$,
    WindowSources.keyUp$,
    isDisabled$)

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
