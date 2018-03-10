import React, {Component} from 'react';
import './App.css';
import {GameState} from './eventSources/gameState';
import {MainPlayer} from './blobs/mainPlayer';

class App extends Component {

  constructor() {
    super();

    this.state = {
      title: ''
    }
  }

  componentDidMount() {
    GameState.initialize().subscribe(this.initialize);
  }

  initialize = data => {
    this.setState(prevState => ({
      title: data.title
    }));
  };


  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <MainPlayer/>
      </div>
    );
  }
}


export default App;
