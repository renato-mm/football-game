import React from 'react';
import './division.css';
import Match from './match';
import * as Teams from './teams';
import * as teamHomeFunc from './teamHomeFunctions';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matchesStarted: 0,
      startTime: 1,
      elapsedTime: 0,
      matchesDone: 0,
    };
    this.handler = props.handler;
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
    teamHomeFunc.selectFormation(this.handler, this.handler.get("Team",home,"players"), 'A');
    teamHomeFunc.selectFormation(this.handler ,this.handler.get("Team",away,"players"), 'A');
    return (
      <Match
      handler = {this.handler}
      homeTeam = {home}
      awayTeam = {away}
      playCallBack = {(p1) => this.matchPlay(p1)}/>
    );
  }
  
  render(){
    return (
      <div
        className = {"divisionBox"}
      >
        <button onClick = {() => this.startMatches()}>Start: {this.state.elapsedTime.toString()}</button>
        <div>
          {this.renderMatch(1, 2)}
          {this.renderMatch(3, 4)}
          {this.renderMatch(5, 6)}
          {this.renderMatch(7, 8)}
          {this.renderMatch(9, 10)}
          {this.renderMatch(11, 12)}
          {this.renderMatch(13, 14)}
          {this.renderMatch(15, 16)}
          {this.renderMatch(17, 18)}
          {this.renderMatch(19, 20)}
          {this.renderMatch(21, 22)}
          {this.renderMatch(23, 24)}
        </div>
      </div>
    );
  }
}