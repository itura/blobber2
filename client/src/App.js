import React, {Component} from 'react';
import './App.css';
import {Observable} from 'rxjs';
import openSocket from 'socket.io-client';

const style = function (x, y) {
  return {
    position: 'absolute',
    left: x,
    top: y,
    WebkitTransition: 'left .5s, top .5s',
    transition: 'left .5s, top .5s',
    'transitionTimingFunction': 'ease-out'
  }
};

class App extends Component {

  constructor() {
    super();

    this.state = {
      style: {},
      title: ''
    }
  }

  componentDidMount() {
    const socket = openSocket();
    socket.on('connected', data => this.updateTitle(data.username));

    Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .subscribe(this.updatePosition);

    Observable.fromEvent(window, 'mousedown')
      .subscribe(() => socket.emit('click'));
  }

  updatePosition = e => {
    this.setState(prevState => ({
      style: style(e.clientX, e.clientY),
      title: prevState.title
    }));
  };

  updateTitle = title => {
    this.setState(prevState => ({
      style: prevState.style,
      title: title
    }));
  };

  render() {
    return (
      <div style={this.state.style}>
        {this.state.title}
      </div>
    );
  }
}


export default App;
