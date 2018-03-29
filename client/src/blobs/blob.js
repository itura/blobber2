import React, {Component} from 'react';
import {GameState} from '../eventSources/gameState';

export const Location = {
  create(x = 0, y = 0) {
    return {x, y};
  }
};

export const Direction = {
  create(x = 0, y = 0) {
    return {x, y};
  }
};

const style = function (x, y) {
  return {
    position: 'absolute',
    left: x,
    top: y,
    WebkitTransition: 'all .5s ease-out',
    transition: 'all .5s ease-out',
    overflow: 'visible',
    padding: 0,
    margin: 0
  }
};

export const Blob = ({location, size}) => {
  const baseRadius = (size / 2);
  const strokeWidth = 5;

  if (baseRadius <= strokeWidth) {
    return null;
  }

  const innerRadius = baseRadius - strokeWidth;
  const outerRadius = baseRadius + strokeWidth;

  // Adjust the coordinates left and up so that the circle is drawn
  // in the center of the canvas
  const adjustedX = location.x - outerRadius;
  const adjustedY = location.y - outerRadius;

  return (
    <div style={style(adjustedX, adjustedY)}>
      <svg width={size} height={size}>
        <circle cx={baseRadius} cy={baseRadius} r={innerRadius} stroke="navy" strokeWidth={strokeWidth} fill="blue"/>
      </svg>
    </div>
  )
};

export class SmolBlob extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      location: props.location,
      size: props.size
    }
  }

  componentDidMount() {
    this.subscriptions = [
      GameState.get('move', this.state.id)
        .map(event => event.location)
        .subscribe(this.move)
    ];
  }

  componentWillUnMount() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  move = newLocation => {
    this.setState(prevState => ({
      location: newLocation,
    }));
  };

  grow = size => {
    this.setState(prevState => ({
      size: size,
    }));
  };

  render() {
    return (
      <Blob location={this.state.location} size={this.state.size}/>
    )
  }
}
