import React from 'react';
import './division.css';
import Match from './match';
import * as Teams from './teams';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squarePos: 290,
    };
  }

  startMatches(){
    //
  }

  renderMatch(home, away) {
    return (
      <Match homeTeam = {home} awayTeam = {away}/>
    );
  }
  
  render(){
    return (
      <div
        className = {"divisionBox"}
      >
        <button onClick = {this.startMatches()}>Start matches</button>
        <div>
          {this.renderMatch(Teams.cruzeiro, Teams.atleticoMG)}
          {this.renderMatch(Teams.atleticoMG, Teams.cruzeiro)}
        </div>
      </div>
    );
  }
}