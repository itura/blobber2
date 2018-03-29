import React, {Component} from 'react';
import {UserInput, Directions} from '../eventSources/userInput';
import {GameState} from '../eventSources/gameState';
import {Blob, Location, Direction} from './blob';

export class MainPlayer extends Component {
  constructor() {
    super();

    this.state = {
      id: 0,
      location: Location.create(),
      direction: Direction.create(),
      size: 0.
    }
  }

  componentDidMount() {
    this.subscriptions = [
      GameState.get('initialize').subscribe(this.initialize)
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initialize = data => {
    this.setState(prevState => ({
      id: data.id,
      location: data.location,
      size: data.size
    }));

    this.subscriptions.push(
      GameState.get('move', data.id)
        .map(event => event.location)
        .subscribe(this.move),
      UserInput.mouseMove().subscribe(this.mouseHandle(data.id)),
      UserInput.mouseDown().subscribe(this.clickHandle(data.id)),
      UserInput.keyDown().subscribe(this.handleKeyDown(data.id)),
      UserInput.keyUp().subscribe(this.handleKeyUp(data.id))
    );
  };
  //User Input Handlers
  handleKeyDown = id => event => {
    const newDirection = Direction.create();
    event.keyCombo().forEach(keyCode => {
      if (keyCode in Directions) {
        newDirection.x = newDirection.x + Directions[keyCode].x;
        newDirection.y = newDirection.y + Directions[keyCode].y;
      }
    });
    if (newDirection !== Direction.create()) {
      GameState.notify('updateDirection', {id: id, direction: newDirection});
    }
  };

  handleKeyUp = id => event => {
    const newDirection = Direction.create();
    event.keyCombo().forEach(keyCode => {
      if (keyCode in Directions) {
        newDirection.x = newDirection.x + -1*Directions[keyCode].x;
        newDirection.y = newDirection.y + -1*Directions[keyCode].y;
      }
    });
    if (newDirection !== this.direction) {
      GameState.notify('updateDirection', {id: id, direction: newDirection});
    }
  };

  mouseHandle = id => location => {
    //pass
  };

  clickHandle = id => location => {
    //pass
  };

  //Server Command Handlers
  move = newPosition => {
    this.setState(prevState => ({location: newPosition}));
  };

  msg = message => {
    console.log(message);
  }

  render() {
    return (
      <Blob location={this.state.location} size={this.state.size}/>
    )
  }
}
