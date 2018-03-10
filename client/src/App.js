import React, {Component} from 'react';
import './App.css';
import {Observable} from 'rxjs';
import openSocket from 'socket.io-client';

const style = function (x, y) {
  return {
    position: 'absolute',
    left: x,
    top: y,
    WebkitTransition: 'all .5s, top .5s',
    transition: 'all .5s, top .5s',
    'transitionTimingFunction': 'ease-out',
    overflow: 'visible',
    padding: 0,
    margin: 0
  }
};

const Location = (x, y) => ({x, y});

const Blob = ({location, size}) => {
  const strokeWidth = 5;
  const baseRadius = (size / 2);
  const innerRadius = baseRadius - strokeWidth;
  const outerRadius = baseRadius + strokeWidth;
  const centerX = location.x - outerRadius;
  const centerY = location.y - outerRadius;

  return (
    <div style={style(centerX, centerY)}>
      <svg width={size} height={size}>
        <circle cx={baseRadius} cy={baseRadius} r={innerRadius} stroke="navy" strokeWidth={strokeWidth} fill="blue"/>
      </svg>
    </div>
  )
};

class App extends Component {

  constructor() {
    super();

    this.state = {
      location: Location(0, 0),
      title: '',
      size: 200
    }
  }

  componentDidMount() {
    const socket = openSocket();
    socket.on('connected', data => this.initialize(data));

    Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .subscribe(this.updatePosition);

    Observable.fromEvent(window, 'mousedown')
      .subscribe(this.increaseSize);
  }

  updatePosition = e => {
    this.setState(prevState => ({
      location: Location(e.clientX, e.clientY),
      title: prevState.title,
      size: prevState.size
    }));
  };

  initialize = data => {
    this.setState(prevState => ({
      location: data.location,
      title: data.title,
      size: data.size
    }));
  };

  increaseSize = () => {
    this.setState(prevState => ({
      location: prevState.location,
      title: prevState.title,
      size: prevState.size + 20
    }))
  };

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <Blob location={this.state.location} size={this.state.size}/>
      </div>
    );
  }
}


export default App;
