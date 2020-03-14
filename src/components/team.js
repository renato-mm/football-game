import React from 'react';
import './team.css';

export default function Team(props) {
  const colors = {
    background: props.team.color1,
    color: props.team.color2,
  };

  return (
    <div
      style = {colors}
      className = {"team "+props.side}
      onClick = { props.squareOnClick }
    >
      {props.team.name}
    </div>
  );
}