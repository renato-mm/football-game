import React from 'react';
import './division.css';
import Match from './match';
import * as teamHomeFunc from './teamHomeFunctions';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matchesStarted: 0,
      startTime: 1,
      elapsedTime: 0,
      matchesDone: 0,
      interval: 0,
      matchTime: 0
    };
    this.handler = props.handler;
  }

  startMatches(){
    if (this.state.matchesStarted === 0) {
      this.setState({interval: setInterval(() => this.matchPlay(), 50)})
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t} )
    }
  }

  matchPlay(){
    if (this.state.matchesStarted === 1) {
      if (this.state.matchTime < 90) {
        let time = this.state.matchTime + 1
        this.props.handler.runMatches(time)
        let d = new Date()
        let t = d.getTime()
        let elapsedTime = t - this.state.startTime
        this.setState( {elapsedTime: elapsedTime, matchTime: time} )
      } else {
        clearInterval(this.state.interval)
        this.setState( { matchesStarted : 2 } )
      }
    }
  }

  renderMatch(ind) {
    //teamHomeFunc.selectFormation(this.handler, this.handler.get("Team",home,"players"), 'A');
    //teamHomeFunc.selectFormation(this.handler ,this.handler.get("Team",away,"players"), 'A');
    return (
      <Match
      key = {ind}
      handler = {this.handler}
      time = {this.state.matchTime}
      matchInd = {ind}/>
    );
  }
  
  render(){
    let matches = this.props.handler.get("Match", 0, "current matches")
    let inds = []
    //console.log("Matches", matches)
    for (let x = 0 ; x < matches.length ; x++) {
      //console.log(x)
      inds.push(x)
    }
    return (
      <div
        className = {"divisionBox"}
      >
        <button onClick = {() => this.startMatches()}>Start: {this.state.elapsedTime.toString()}</button>
        <div>
          {inds.map((e) => {return this.renderMatch(e)})}
        </div>
      </div>
    );
  }
}