import { createVector } from '../../../shared/vector'
import { merge } from 'rxjs/observable/merge'
import { filter, map, sampleTime, share, tap } from 'rxjs/operators'
import { LockedSubject, ToggleSubject, unless } from '../../../shared/subjects'
import { KeyCombo, Keys } from './keys'
import { Set } from 'immutable'

export function createUserInput (WindowSources) {
  const movementKeys = Set([Keys.W, Keys.A, Keys.S, Keys.D])
  let currentKeyCombo = KeyCombo()
  const isTyping$ = ToggleSubject(false)
  const isLocked$ = LockedSubject()
  isTyping$.subscribe(isLocked$.observer())

  WindowSources.blur$.subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown$ = WindowSources.keyDown$.pipe(
    filter(event => movementKeys.includes(event.keyCode)),
    map(event => currentKeyCombo.add(event.keyCode)),
    filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    share()
  )

  const keyUp$ = WindowSources.keyUp$.pipe(
    filter(event => movementKeys.includes(event.keyCode)),
    map(event => currentKeyCombo.remove(event.keyCode)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    share()
  )

  WindowSources.keyUp$.subscribe(event => {
    currentKeyCombo = currentKeyCombo.delete(event.keyCode)
  })

  const mouseMove$ = WindowSources.mouseMove$.pipe(
    sampleTime(100),
    map(event => createVector(event.clientX, event.clientY))
  )

  const mouseDown$ = WindowSources.mouseDown$

  const userInput = {
    isTyping$: isTyping$,
    mouseMove$: mouseMove$,
    mouseDown$: mouseDown$,

    movement () {
      return merge(keyDown$, keyUp$).pipe(
        unless(isLocked$)
      )
    }
  }

  WindowSources.keyDown$
    .pipe(filter(event => event.keyCode === Keys.ENTER))
    .subscribe(isTyping$)

  return userInput
}
