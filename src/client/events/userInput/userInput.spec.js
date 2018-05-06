/* eslint-env jest */

import { Subject } from 'rxjs'
import { Keys } from './keys'
import { createUserInput } from './userInput'

function windowEventFor (keyCode) {
  return {
    keyCode: keyCode
  }
}

describe('UserInput', () => {
  let UserInput, WindowSources

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

  it('emits key press events', done => {
    UserInput.keyPress().subscribe(
      value => {
        expect(value).toEqual('hi')
        done()
      },
      error => done.fail(error)
    )

    WindowSources.keyDown$.next(windowEventFor(Keys.A))
  })
})
