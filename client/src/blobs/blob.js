import React from 'react';

export const Location = {
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

  if (baseRadius < strokeWidth) {
    return null;
  }

  const innerRadius = baseRadius - strokeWidth;
  const outerRadius = baseRadius + strokeWidth;
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
