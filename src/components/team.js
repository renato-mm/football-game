import React from 'react';
import './team.css';

export default function Team(props) {

  const  colors = {
    background: props.handler.get("Team",props.team,"color1"),
    color: props.handler.get("Team",props.team,"color2"),
  }

  return (
    <div
      style = {colors}
      className = {"team "+props.side}
      onClick = {props.handleShow}
    >
      {props.handler.get("Team",props.team,"name")}
    </div>
  );
}