import React, {Component} from 'react';
import {UserInput} from '../eventSources/userInput';
import {GameState} from '../eventSources/gameState';
import {Blob, Location} from './blob';

export class MainPlayer extends Component {
  constructor() {
    super();

    this.state = {
      id: 0,
      location: Location.create(),
      size: 0
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
    console.log('keyDown', event.keyCombo());
  };

  handleKeyUp = id => event => {
    console.log('keyUp', event.keyCombo());
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

  render() {
    return (
      <Blob location={this.state.location} size={this.state.size}/>
    )
  }
}
