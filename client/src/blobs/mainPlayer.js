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
      GameState.get('grow', data.id)
        .map(event => event.size)
        .subscribe(this.grow),
      GameState.get('move', data.id)
        .map(event => event.location)
        .subscribe(this.move),
      UserInput.mouseMove().subscribe(this.follow(data.id)),
      UserInput.mouseDown().subscribe(this.increaseSize(data.id))
    );
  };

  follow = id => location => {
    console.log('follow', id, location);
    GameState.notify('move', {id, location});
  };

  increaseSize = id => () => {
    GameState.notify('grow', {id: id});
  };

  grow = size => {
    this.setState(prevState => ({size: size}));
  };

  move = newPosition => {
    this.setState(prevState => ({location: newPosition}));
  };

  render() {
    return (
      <Blob location={this.state.location} size={this.state.size}/>
    )
  }
}
