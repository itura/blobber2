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
    GameState.get('initialize').subscribe(this.initialize);
    UserInput.mouseMove().subscribe(this.follow);
    UserInput.mouseDown().subscribe(this.increaseSize);
  }

  initialize = data => {
    this.setState(prevState => ({
      id: data.id,
      location: data.location,
      size: data.size
    }));
  };

  follow = newPosition => {
    this.setState(prevState => ({location: newPosition}));
    GameState.notifyOfMoveEvent(this.state.id, newPosition);
  };

  increaseSize = () => {
    this.setState(prevState => ({
      size: prevState.size + 20
    }))
  };

  render() {
    return (
      <Blob location={this.state.location} size={this.state.size}/>
    )
  }
}
