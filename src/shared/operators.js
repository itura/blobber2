import { filter, map, withLatestFrom } from 'rxjs/operators'

export const unless = locked$ => source$ => source$.pipe(
  withLatestFrom(locked$),
  filter(([event, locked]) => !locked),
  map(([event, locked]) => event)
)
