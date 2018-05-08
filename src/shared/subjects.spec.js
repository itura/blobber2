/* eslint-env jest */

import { LockedSubject, ToggleSubject } from './subjects'

describe('LockedSubject', () => {
  let lockedSubject$

  beforeEach(() => {
    lockedSubject$ = LockedSubject()
  })

  it('is open initially', done => {
    let isLocked
    lockedSubject$.subscribe(
      _isLocked => { isLocked = _isLocked },
      done.fail)

    expect(isLocked).toEqual(false)

    done()
  })

  it('closes when lock is called', done => {
    let isLocked
    lockedSubject$.subscribe(
      _isLocked => { isLocked = _isLocked },
      done.fail)

    lockedSubject$.lock()
    expect(isLocked).toEqual(true)

    done()
  })

  it('is reopened by the key returned from the lock method', done => {
    let isLocked
    lockedSubject$.subscribe(
      _isLocked => { isLocked = _isLocked },
      done.fail)

    const key = lockedSubject$.lock()
    expect(isLocked).toEqual(true)
    key()
    expect(isLocked).toEqual(false)

    done()
  })

  it('only honors the current key', done => {
    let isLocked
    lockedSubject$.subscribe(
      _isLocked => { isLocked = _isLocked },
      done.fail)

    const key1 = lockedSubject$.lock()
    expect(isLocked).toEqual(true)

    key1()
    expect(isLocked).toEqual(false)

    const key2 = lockedSubject$.lock()
    expect(isLocked).toEqual(true)

    key1() // does not unlock
    expect(isLocked).toEqual(true)

    key2()
    expect(isLocked).toEqual(false)

    done()
  })
})

describe('ToggleSubject', () => {
  let toggleSubject$

  beforeEach(() => {
    toggleSubject$ = ToggleSubject()
  })

  it('is enabled initially', done => {
    let isEnabled
    toggleSubject$.subscribe(
      _isEnabled => { isEnabled = _isEnabled },
      done.fail)

    expect(isEnabled).toEqual(true)

    done()
  })

  it('takes an initial value', done => {
    toggleSubject$ = ToggleSubject(false)

    let isEnabled
    toggleSubject$.subscribe(
      _isEnabled => { isEnabled = _isEnabled },
      done.fail)

    expect(isEnabled).toEqual(false)

    done()
  })

  it('toggles', done => {
    let isEnabled
    toggleSubject$.subscribe(
      _isEnabled => { isEnabled = _isEnabled },
      done.fail)

    toggleSubject$.toggle()
    expect(isEnabled).toEqual(false)

    toggleSubject$.toggle()
    expect(isEnabled).toEqual(true)

    done()
  })

  it('toggles when next is called, ignoring any arguments', done => {
    let isEnabled
    toggleSubject$.subscribe(
      _isEnabled => { isEnabled = _isEnabled },
      done.fail)

    toggleSubject$.next()
    expect(isEnabled).toEqual(false)

    toggleSubject$.next()
    expect(isEnabled).toEqual(true)

    done()
  })
})
