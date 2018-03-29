import React, {Component} from 'react';
import './App.css';
import {GameState} from './eventSources/gameState';
import {MainPlayer} from './blobs/mainPlayer';
import {SmolBlob} from './blobs/blob';

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
      GameState.get('initialize').subscribe(this.initialize)

      // debug monitoring
      //Observable.timer(1000, 2000)
      //  .subscribe(value => console.log('blobs:', this.state.blobs.length, this.state.blobs.map(blob => blob.id)))
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

    this.subscriptions.push(
      GameState.get('newPlayer').subscribe(this.addPlayer(data.id)),
      GameState.get('remove')
        .map(event => event.id)
        .subscribe(this.removePlayer))
  };

  addPlayer = id => player => {
    this.setState(prevState => {
      let blobs = prevState.blobs;

      if (player.id !== id) {
        blobs.push(player);
      }

      return {blobs};
    });
  };

  removePlayer = id => {
    this.setState(prevState => {
      const blob = prevState.blobs.find(blob => blob.id === id);
      if (blob) {
        const index = prevState.blobs.indexOf(blob);
        prevState.blobs.splice(index, 1)
        return {
          blobs: prevState.blobs
        }
      }
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
