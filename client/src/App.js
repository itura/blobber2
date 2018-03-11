import React, {Component} from 'react';
import './App.css';
import {GameState} from './eventSources/gameState';
import {MainPlayer} from './blobs/mainPlayer';
import {SmolBlob} from './blobs/blob';
import {Observable} from 'rxjs';

class App extends Component {

  constructor() {
    super();

    this.state = {
      title: '',
      blobs: [],
      mainPlayerId: 0
    }
  }

  componentDidMount() {
    this.subscriptions = [
      GameState.get('initialize').subscribe(this.initialize),
      GameState.get('newPlayer').subscribe(this.addPlayer),

      // debug monitoring
      Observable.timer(1000, 2000)
        .subscribe(value => console.log('blobs:', this.state.blobs.length, this.state.blobs.map(blob => blob.id)))
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  initialize = data => {
    this.setState(prevState => ({
      title: data.title,
      blobs: data.blobs.filter(blob => blob.id !== data.id),
      mainPlayerId: data.id
    }));
  };

  addPlayer = player => {
    this.setState(prevState => {
      let blobs = prevState.blobs;

      if (player.id !== this.state.mainPlayerId) {
        blobs.push(player);
      }

      return {blobs};
    })
  };


  render() {
    const blobComponents = this.state.blobs.map(blob => (
      <SmolBlob key={blob.id} id={blob.id} location={blob.location} size={blob.size}/>
    ));

    return (
      <div>
        <h1>{this.state.title}</h1>
        <MainPlayer/>
        {blobComponents}
      </div>
    );
  }
}


export default App;
