import React from 'react';
import './division.css';
import Match from './match';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squarePos: 290,
    };
  }

  renderMatch() {
    return (
      <Match />
    );
  }
  
  render(){
    return (
      <div
        className = {"divisionBox"}
      >
        {this.renderMatch()}
      </div>
    );
  }
}