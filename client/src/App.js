import React, {Component} from 'react';
import './App.css';
import {Observable} from 'rxjs';

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
      style: {}
    }
  }

  componentDidMount() {
    Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .subscribe(e => {
        this.setState((prevState, props) => ({
          style: style(e.clientX, e.clientY)
        }));
      });
  }

  render() {
    return (
      <div style={this.state.style}>
        Hello
      </div>
    );
  }
}


export default App;
