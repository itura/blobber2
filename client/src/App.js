import React, {Component} from 'react';
import './App.css';
import {GameState} from './eventSources/gameState';
import {MainPlayer} from './blobs/mainPlayer';
import {Blob} from './blobs/blob';

class App extends Component {

  constructor() {
    super();

    this.state = {
      title: '',
      blobs: []
    }
  }

  componentDidMount() {
    GameState.get.initialize().subscribe(this.initialize);
  }

  initialize = data => {
    this.setState(prevState => ({
      title: data.title,
      blobs: data.blobs
    }));
  };


  render() {
    const blobComponents = this.state.blobs.map(blob => (<Blob key={blob.id} location={blob.location} size={blob.size}/>))
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
