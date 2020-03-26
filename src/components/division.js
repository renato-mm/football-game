import React from 'react';
import './division.css';
import Match from './match';
import * as Teams from './teams';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squarePos: 290,
      matchesStarted: 0,
      startTime: 1,
      elapsedTime: 0,
      matchesDone: 0,
    };
  }

  startMatches(){
    if (this.state.matchesStarted === 0) {
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t} )
    }
  }

  matchPlay(matchDone){
    console.log(matchDone)
    if (this.state.matchesStarted === 1) {
      if (!matchDone) {
        this.setState( { matchesDone : 0 } )
      }
      let d = new Date()
      let t = d.getTime()
      let elapsedTime = t - this.state.startTime
      this.setState( {elapsedTime: elapsedTime} )
      if (elapsedTime % 100 === 0) {
        if (this.state.matchesDone) {
          this.setState( { matchesStarted : 2 } )
        } else {
          this.setState( { matchesDone : 1 } )
        }
      }
      return elapsedTime 
    }
  }

  renderMatch(home, away) {
    return (
      <Match homeTeam = {home} awayTeam = {away} playCallBack = {(p1) => this.matchPlay(p1)}/>
    );
  }
  
  render(){
    return (
      <div
        className = {"divisionBox"}
      >
        <button onClick = {() => this.startMatches()}>Start: {this.state.elapsedTime.toString()}</button>
        <div>
          {this.renderMatch(Teams.cruzeiro, Teams.atleticoMG)}
          {this.renderMatch(Teams.flamengo, Teams.liverpool)}
        </div>
      </div>
    );
  }
}