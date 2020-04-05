import React from 'react';
import './team.css';

export default class Team extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      team: props.team,
      side: props.side,
      click: props.handleShow
    };
    this.handleShow = props.handleShow;
  }

  render(){
    const  colors = {
      background: this.state.team.color1,
      color: this.state.team.color2,
    }
    return (
      <div
        style = {colors}
        className = {"team "+this.state.side}
        onClick = {this.handleShow}
      >
        {this.state.team.name}
      </div>
    );
  }
}