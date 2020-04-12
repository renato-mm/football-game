import React from 'react';
import './division.css';
import Match from './match';
import PieChart from 'react-minimal-pie-chart';

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

  matchesButtonFunc(event){
    if (this.state.matchesStarted === 0) {
      this.matchesInterval = setInterval(() => this.matchPlay(), 50)
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t} )
    } else if (this.state.matchesStarted === 2) {
      this.props.handler.runMatches(-2)
      this.setState( { matchesStarted : 0, elapsedTime: 0, matchTime: 0 } )
      this.props.matchesCallback("End")
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

  renderDivisions(m, i, day) {
    let div_sizes = this.props.handler.get("League", 0, "division sizes")
    let season = this.props.handler.get("Season", 0, "year")
    let divisions = []
    for (let x = 0 ; x < div_sizes[0] ; x++) {
      divisions.push(i.slice(x * div_sizes[1], (x+1) * div_sizes[1]))
    } 
    return (
      <div className = {"divisionsBox"}>
        Season: {season} --- {day[0]} Round : {day[1]} ___________ Time : {this.state.matchTime}
        <div className = {"clock"}>
          <PieChart
            data={[
              { title: 'Time', value: this.state.matchTime, color: 'blue' },
              { title: '', value: 90 - this.state.matchTime, color: 'white' },
            ]}
            startAngle={-90}
          />
        </div>
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

  renderCup(m, i, day) {
    let season = this.props.handler.get("Season", 0, "year")
    return (
      <div className = {"cupBox"}>
        Season: {season} --- {day[0]} Round : {day[1]}  ___________ Time : {this.state.matchTime}
        { i.map((id) => {return this.renderMatch(id)}) }
      </div>
      )
  }
  
  render(){
    let colors = {
      background: this.props.buttonColors[0],
      color: this.props.buttonColors[1],
    }
    let day = this.props.handler.get("Season", 0, "day")
    let matches = this.props.handler.get("Match", 0, "current matches")
    //console.log(matches)
    let inds = []
    //console.log("Matches", matches)
    for (let x = 0 ; x < matches.length ; x++) {
      //console.log(x)
      inds.push(x)
    }
    return (
      <>
        <div className = {"matchesTopMenu"}>
          <button 
            className = {"finishButton"} 
            style = {colors}
            onClick = {() => this.matchesButtonFunc()} 
            disabled = {(this.state.matchesStarted === 1) ? true : false}
            > 
            {(this.state.matchesStarted === 0) ? "Start" : "Finish"} Round 
          </button>
        </div>
        <div className = {"matchesBoard"}>
          <div
            className = {"matchesBox"}
          >
            {(day[0] === "League") ? this.renderDivisions(matches, inds, day) : this.renderCup(matches, inds, day)}
          </div>
        </div>
      </>
    );
  }
}