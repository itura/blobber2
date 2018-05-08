import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { filter } from 'rxjs/operators'

export function LockedSubject () {
  let locked = false
  const locked$ = new BehaviorSubject(false)

  return Object.assign(locked$, {

    lock () {
      if (locked) {
        return false
      }

      locked = true
      this.next(true)

      let used = false
      return () => {
        if (!used) {
          used = true
          locked = false
          this.next(false)
        }
      }
    }
  })
}

export function ToggleSubject (initial = true) {
  let enabled = initial
  const enabled$ = new BehaviorSubject(initial)
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
