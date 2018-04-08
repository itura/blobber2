import React, { Component } from 'react'
import { UserInput, Directions } from '../eventSources/userInput'
import { GameState } from '../eventSources/gameState'
import { Blob, Vector, round } from './blob'

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
      GameState.get('init').subscribe(this.initialize)
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
      GameState.get('pm', data.id)
        .map(event => event.location)
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
      newDirection.x = round(newDirection.x / mag, 3)
      newDirection.y = round(newDirection.y / mag, 3)
      GameState.notify('ud', {id: id, direction: newDirection})
    }
  }

  mouseHandle = id => location => {
    const newLookDirection = Vector.create()
    const mag = Math.sqrt((location.x * location.x) + (location.y * location.y))
    newLookDirection.x = round(location.x / mag, 3)
    newLookDirection.y = round(location.y / mag, 3)
    GameState.notify('mm', {id: id, direction: newLookDirection})
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
