import { createVector } from '../../../shared/vector'
import { merge } from 'rxjs/observable/merge'
import { filter, map, sampleTime, share, tap } from 'rxjs/operators'
import { LockedSubject, ToggleSubject, unless } from '../../../shared/subjects'
import { KeyCombo, KeyCombos } from './keys'

function KeyPressEvent (keyCombo) {
  return {
    keyCombo () {
      return keyCombo
    }
  }
}

export function createUserInput (WindowSources) {
  let currentKeyCombo = KeyCombo()
  const isTyping$ = ToggleSubject(false)
  const isLocked$ = LockedSubject()
  isTyping$.subscribe(isLocked$.observer())

  WindowSources.blur$.subscribe(event => {
    currentKeyCombo = currentKeyCombo.clear()
  })

  const keyDown$ = WindowSources.keyDown$.pipe(
    map(event => currentKeyCombo.add(event.keyCode)),
    filter(newKeyCombo => !newKeyCombo.equals(currentKeyCombo)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
    share()
  )

  const keyUp$ = WindowSources.keyUp$.pipe(
    map(event => currentKeyCombo.remove(event.keyCode)),
    tap(newKeyCombo => { currentKeyCombo = newKeyCombo }),
    map(newKeyCombo => KeyPressEvent(newKeyCombo)),
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

    keyPress () {
      return merge(keyDown$, keyUp$).pipe(
        unless(isLocked$)
      )
    }
  }

  keyDown$
    .pipe(filter(event => event.keyCombo().equals(KeyCombos.TYPE)))
    .subscribe(isTyping$)

  return userInput
}
