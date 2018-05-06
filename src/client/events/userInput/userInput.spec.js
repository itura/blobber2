/* eslint-env jest */

import { Subject } from 'rxjs'
import { KeyCombo, Keys } from './keys'
import { createUserInput } from './userInput'

function windowEventFor (keyCode) {
  return {
    keyCode: keyCode
  }
}

describe('UserInput', () => {
  let UserInput, WindowSources

  function press (key) {
    WindowSources.keyDown$.next(windowEventFor(key))
    WindowSources.keyUp$.next(windowEventFor(key))
  }

  beforeEach(() => {
    WindowSources = {
      keyDown$: new Subject(),
      keyUp$: new Subject(),
      blur$: new Subject(),
      mouseMove$: new Subject(),
      mouseDown$: new Subject()
    }
    UserInput = createUserInput(WindowSources)
  })

  describe('#movement', () => {
    it('emits the current KeyCombo', done => {
      UserInput.movement().subscribe(
        value => {
          expect(value).toEqual(KeyCombo(Keys.A))
          done()
        },
        done.fail
      )

      WindowSources.keyDown$.next(windowEventFor(Keys.A))
    })

    describe('current KeyCombo', () => {
      describe('adding keys', () => {
        it('keydown events add keys', done => {
          const results = []
          UserInput.movement().subscribe(
            value => results.push(value),
            done.fail
          )

          WindowSources.keyDown$.next(windowEventFor(Keys.A))
          WindowSources.keyDown$.next(windowEventFor(Keys.W))

          expect(results).toEqual([
            KeyCombo(Keys.A),
            KeyCombo(Keys.A, Keys.W)
          ])

          done()
        })

        it('duplicate keydown events are ignored ', done => {
          const results = []
          UserInput.movement().subscribe(
            value => results.push(value),
            done.fail
          )

          WindowSources.keyDown$.next(windowEventFor(Keys.A))
          WindowSources.keyDown$.next(windowEventFor(Keys.A))
          WindowSources.keyDown$.next(windowEventFor(Keys.A))
          WindowSources.keyDown$.next(windowEventFor(Keys.A))

          expect(results).toEqual([
            KeyCombo(Keys.A)
          ])

          done()
        })
      })

      describe('removing keys', () => {
        it('keyup events remove keys', done => {
          const results = []
          UserInput.movement().subscribe(
            value => results.push(value),
            done.fail
          )

          WindowSources.keyDown$.next(windowEventFor(Keys.A))
          WindowSources.keyDown$.next(windowEventFor(Keys.W))
          WindowSources.keyUp$.next(windowEventFor(Keys.A))
          WindowSources.keyUp$.next(windowEventFor(Keys.W))

          expect(results).toEqual([
            KeyCombo(Keys.A),
            KeyCombo(Keys.A, Keys.W),
            KeyCombo(Keys.W),
            KeyCombo()
          ])

          done()
        })
      })

      it('only includes W, A, S, and D keys', done => {
        const results = []
        UserInput.movement().subscribe(
          value => results.push(value),
          done.fail
        )

        WindowSources.keyDown$.next(windowEventFor(Keys.A))
        WindowSources.keyDown$.next(windowEventFor(Keys.W))
        WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
        WindowSources.keyDown$.next(windowEventFor(Keys.M))
        WindowSources.keyDown$.next(windowEventFor(Keys.ALT))

        expect(results).toEqual([
          KeyCombo(Keys.A),
          KeyCombo(Keys.A, Keys.W)
        ])

        done()
      })
    })
  })

  describe('locking', () => {
    it('stops emitting events when the user begins typing', done => {
      const results = []
      UserInput.movement().subscribe(
        value => results.push(value),
        done.fail
      )

      press(Keys.A)
      press(Keys.ENTER)
      press(Keys.W)

      expect(results).toEqual([
        KeyCombo(Keys.A),
        KeyCombo()
      ])

      done()
    })

    it('resumes emitting events when the user stops typing', done => {
      const results = []
      UserInput.movement().subscribe(
        value => results.push(value),
        done.fail
      )

      press(Keys.A)
      press(Keys.ENTER)
      press(Keys.ENTER)
      press(Keys.W)

      expect(results).toEqual([
        KeyCombo(Keys.A),
        KeyCombo(),
        KeyCombo(Keys.W),
        KeyCombo()
      ])

      done()
    })
  })

  describe('#isTyping', () => {
    it('emits true when the enter key is pressed the first time', done => {
      const results = []
      UserInput.isTyping$.subscribe(
        value => results.push(value),
        done.fail
      )

      WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
      WindowSources.keyUp$.next(windowEventFor(Keys.ENTER))

      expect(results).toEqual([true])

      done()
    })

    it('emits false when the enter key is pressed the second time', done => {
      const results = []
      UserInput.isTyping$.subscribe(
        value => results.push(value),
        done.fail
      )

      WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
      WindowSources.keyUp$.next(windowEventFor(Keys.ENTER))
      WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
      WindowSources.keyUp$.next(windowEventFor(Keys.ENTER))

      expect(results).toEqual([true, false])

      done()
    })

    describe('#subscribeWith', () => {
      it('allows you to subscribe to streams that emit when user is and is not typing respectively', done => {
        const results = []
        UserInput.isTyping$.subscribeWith(
          () => results.push(true),
          () => results.push(false)
        )

        WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
        WindowSources.keyUp$.next(windowEventFor(Keys.ENTER))
        WindowSources.keyDown$.next(windowEventFor(Keys.ENTER))
        WindowSources.keyUp$.next(windowEventFor(Keys.ENTER))

        expect(results).toEqual([true, false])

        done()
      })
    })
  })
})
