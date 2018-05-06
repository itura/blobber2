/* eslint-env jasmine */

import { Subject } from 'rxjs/Subject'
import { unless } from './operators'

describe('unless', () => {
  it('passes events when the lock$ is closed', done => {
    const source$ = new Subject()
    const lock$ = new Subject()

    const results = []
    source$
      .pipe(unless(lock$))
      .subscribe(
        value => results.push(value),
        fail,
        () => {
          expect(results).toEqual(['hi'])
          done()
        }
      )

    lock$.next(false)
    source$.next('hi')
    source$.complete()
  })

  it('swallows events when the lock$ is open', done => {
    const source$ = new Subject()
    const lock$ = new Subject()

    const results = []
    source$
      .pipe(unless(lock$))
      .subscribe(
        value => results.push(value),
        fail,
        () => {
          expect(results).toEqual([])
          done()
        }
      )

    lock$.next(true)
    source$.next('hi')
    source$.complete()
  })
})
