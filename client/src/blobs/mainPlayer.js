import React, { Component } from 'react'
import { Directions, UserInput } from '../eventSources/userInput'
import { GameState } from '../eventSources/gameState'
import { Blob, Vector } from './blob'
import { map } from 'rxjs/operators'

export class MainPlayer extends Component {
  constructor () {
    super()

    this.state = {
      id: 0,
      location: Vector.create(),
      lookDir: Vector.create(),
      size: 0.
    }
  }

  componentDidMount () {
    this.subscriptions = [
      GameState.get('initialize').subscribe(this.initialize)
    ]
  }

  componentWillUnmount () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  initialize = data => {
    this.setState(prevState => ({
      id: data.id,
      location: data.location,
      size: data.size
    }))

    this.subscriptions.push(
      GameState.get('move', data.id)
        .pipe(map(event => event.location))
        .subscribe(this.move),
      UserInput.mouseMove().subscribe(this.mouseHandle(data.id)),
      UserInput.mouseDown().subscribe(this.clickHandle(data.id)),
      UserInput.keyPress().subscribe(this.handleKeyPress(data.id))
    )
  }
  //User Input Handlers
  handleKeyPress = id => event => {
    const newDirection = Vector.create()
    event.keyCombo().forEach(keyCode => {
      if (keyCode in Directions) {
        newDirection.x = newDirection.x + Directions[keyCode].x
        newDirection.y = newDirection.y + Directions[keyCode].y
      }
    })
    if (newDirection !== this.location) {
      const mag = Math.sqrt((newDirection.x * newDirection.x) + (newDirection.y * newDirection.y))
      newDirection.x = newDirection.x / mag
      newDirection.y = newDirection.y / mag
      GameState.notify('updateDirection', {id: id, direction: newDirection})
    }
  }

  mouseHandle = id => location => {
    const newLookDirection = Vector.create()
    const mag = Math.sqrt((location.x * location.x) + (location.y * location.y))
    newLookDirection.x = location.x / mag
    newLookDirection.y = location.y / mag
    GameState.notify('mouseMove', {id: id, direction: newLookDirection})
  }

  clickHandle = id => location => {
    //pass
  }

  //Server Command Handlers
  move = newPosition => {
    this.setState(prevState => ({location: newPosition}))
  }

  msg = message => {
    console.log(message)
  }

  render () {
    return (
      <Blob location={this.state.location} size={this.state.size} top={true}/>
    )
  }
}
