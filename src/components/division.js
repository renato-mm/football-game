import React from 'react';
import './division.css';
import Match from './match';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matchesStarted: 0,
      startTime: 1,
      elapsedTime: 0,
      matchesDone: 0,
      matchTime: 0,
    };
    this.handler = props.handler;
    this.buttonText = ["Start", "Playing", "Next Matches"]
  }

  matchesButtonFunc(){
    if (this.state.matchesStarted === 0) {
      this.matchesInterval = setInterval(() => this.matchPlay(), 50)
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t} )
    } else if (this.state.matchesStarted === 2) {
      this.props.handler.runMatches(-2)
      this.setState( { matchesStarted : 0, elapsedTime: 0, matchTime: 0 } )
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
        this.props.handler.runMatches(-1)
        clearInterval(this.matchesInterval)
        this.setState( { matchesStarted : 2 } )
      }
    }
  }


  renderMatch(ind) {
    return (
      <Match
      key = {ind}
      handler = {this.handler}
      time = {this.state.matchTime}
      matchInd = {ind}/>
    );
  }

  renderDivisions(m, i) {
    let div_sizes = this.props.handler.get("League", 0, "division sizes")
    let round = this.props.handler.get("League", 0, "round")
    let season = this.props.handler.get("Season", 0, "year")
    let divisions = []
    for (let x = 0 ; x < div_sizes[0] ; x++) {
      divisions.push(i.slice(x * div_sizes[1], (x+1) * div_sizes[1]))
    } 
    return (
      <div className = {"divisionsBox"}>
        Season: {season} --- Round : {round} ___________ Time : {this.state.matchTime}
      {divisions.map((e, n) => {
        return (
          <div className = {"divisionBox"}>
            Division {n + 1}
            { e.map((id) => {return this.renderMatch(id)}) }
          </div>
        )
      }
      )
      }
      </div>
    )
  }

  renderCup() {
    return 
  }
  
  render(){
    let tourn = this.props.handler.get("Match", 0, "tournament")
    let matches = this.props.handler.get("Match", 0, "current matches")
    let inds = []
    //console.log("Matches", matches)
    for (let x = 0 ; x < matches.length ; x++) {
      //console.log(x)
      inds.push(x)
    }
    return (
      <div
        className = {"matchesBox"}
      >
        <button onClick = {() => this.matchesButtonFunc()} disabled = {(this.state.matchesStarted === 1) ? true : false}> {this.buttonText[this.state.matchesStarted]} </button>
        {(tourn === "league") ? this.renderDivisions(matches, inds) : this.renderCup()}
      </div>
    );
  }
}