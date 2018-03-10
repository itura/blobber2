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
      style: {},
      title: ''
    }
  }

  componentDidMount() {
    Observable.fromEvent(window, 'mousemove')
      .sampleTime(100)
      .subscribe(e => {
        this.setState((prevState, props) => ({
          style: style(e.clientX, e.clientY),
          title: prevState.title
        }));
      });

    fetch('/api/hello')
      .then(response => response.json())
      .then(responseBody => {
        this.setState((prevState, props) => ({
          style: prevState.style,
          title: responseBody.express
        }));
      })
  }

  render() {
    return (
      <div style={this.state.style}>
        {this.state.title}
      </div>
    );
  }
}


export default App;
