import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import { filter, map, withLatestFrom } from 'rxjs/operators'

export function LockedSubject () {
  let locked = false
  const locked$ = new BehaviorSubject(false)

  return Object.assign(locked$, {

    lock () {
      if (locked) {
        return false
      }

      this.next(true)

      const unlock = () => {
        locked = false
        this.next(false)
      }

      return createKey(unlock)
    },

    observer () {
      let key$ = null

      return {
        next: () => {
          if (key$) {
            key$.next()
            key$ = null
          } else {
            key$ = this.lock()
          }
        }
      }
    }
  })
}

function createKey (finish) {
  const key$ = new Subject()

  key$.subscribe({
    next: finish,
    complete: finish,
    error: finish
  })

  return key$
}

export const unless = locked$ => source$ => source$.pipe(
  withLatestFrom(locked$),
  filter(([event, locked]) => !locked),
  map(([event, locked]) => event)
)

export function ToggleSubject (initial = true) {
  let enabled = initial
  const enabled$ = new Subject()
  const _next = enabled$.next

  return Object.assign(enabled$, {
    toggle () {
      enabled = !enabled
      _next.call(enabled$, enabled)
    },

    next (value) {
      this.toggle()
    },

    subscribeWith (onEnabled, onDisabled) {
      return [
        this.pipe(filter(value => value === true))
          .subscribe(onEnabled),

        this.pipe(filter(value => value === false))
          .subscribe(onDisabled)
      ]
    }
  })
}
