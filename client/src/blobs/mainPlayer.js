import React, {Component} from 'react';
import {UserInput} from '../eventSources/userInput';
import {GameState} from '../eventSources/gameState';
import {Blob, Location} from './blob';

export class MainPlayer extends Component {
  constructor() {
    super();

    this.state = {
      location: Location.create(),
      size: 0
    }
  }

  componentDidMount() {
    GameState.initialize().subscribe(this.initialize);
    UserInput.mouseMove().subscribe(this.updatePosition);
    UserInput.mouseDown().subscribe(this.increaseSize);
  }

  initialize = data => {
    this.setState(prevState => ({
      location: data.location,
      size: data.size
    }));
  };

  updatePosition = event => {
    this.setState(prevState => ({
      location: Location.create(event.clientX, event.clientY)
    }));
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
