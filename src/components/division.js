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
      matchTime: 0,
      matchHalf: 1,
      screen: "Matches",
    };
    this.handler = props.handler;
    this.buttonText = ["Start", "Playing", "Next Matches"]
  }

  matchesButtonFunc(event){
    if (this.state.matchesStarted === 0) {
      this.matchesInterval = setInterval(() => this.matchPlay(), 50)
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t, matchTime: 0} )
    } else if (this.state.matchesStarted === 2) {
      this.props.handler.runMatches(-2)
      this.setState( { matchesStarted : 0, elapsedTime: 0, matchTime: 0 } )
      this.props.matchesCallback("End")
    }
  }

  switchButtonFunc(event){
    if (this.state.screen === "Matches") {
      this.setState({screen: "Switch"})
    } else if (this.state.screen === "Switch") {
      this.setState({screen: "Matches"})
    }
  }

  matchPlay(){
    if (this.state.matchesStarted === 1) {
      let time = this.state.matchTime + 1
      let matchesDone = this.props.handler.runMatches(time, this.state.matchHalf)
      let d = new Date()
      let t = d.getTime()
      let elapsedTime = t - this.state.startTime
      this.setState( {elapsedTime: elapsedTime, matchTime: time} )
      if (matchesDone) {
        clearInterval(this.matchesInterval)
        if (this.state.matchHalf === 1) {
          this.setState({matchHalf: 2, matchesStarted: 0})
        } else if (this.state.matchHalf === 2) {
          this.props.handler.runMatches(-1)
          this.setState( { matchesStarted : 2 } )
        }
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

  renderClock(time) {
    let extraTime = (time > 45) ? time - 45 : 0
    return (<PieChart
                data={[
                  { title: 'Time', value: time - extraTime, color: 'blue' },
                  { title: 'ExtraTime', value: extraTime, color: 'red' },
                  { title: '', value: 60 - time, color: 'white' },
                ]}
                startAngle={-90}
              />)
  }

  renderDivisions(m, i, day) {
    let div_sizes = this.props.handler.get("League", 0, "division sizes")
    let divisions = []
    for (let x = 0 ; x < div_sizes[0] ; x++) {
      divisions.push(i.slice(x * div_sizes[1], (x+1) * div_sizes[1]))
    } 
    return (
        <>
          {divisions.map((e, n) => {
            return (
              <div className = {"divisionBox"}>
                <div className = {"divisionNumber"}>
                  Division {n + 1}
                </div>
                { e.map((id) => {return this.renderMatch(id)}) }
              </div>
              )
          })}
        </>
    )
  }

  renderCup(m, i, day) {
    return (
        <div className = {"cupBox"}>
          { i.map((id) => {return this.renderMatch(id)}) }
        </div>
      )
  }
  
  render(){
    let colors = {
      background: this.props.buttonColors[0],
      color: this.props.buttonColors[1],
    }
    let season = this.props.handler.get("Season", 0, "year")
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
            {(this.state.matchesStarted === 0) ? "Start" : "Finish"} Half {this.state.matchHalf}
          </button>
          <button 
            className = {"switchButton"} 
            style = {colors}
            onClick = {() => this.switchButtonFunc()} 
            > 
            {(this.state.screen === "Matches") ? "Switch Players" : "Return to Matches"}
          </button>
        </div>
        <div className = {"matchesBoard"}>
          <div className = {"matchesBox"}>
            <div className = {"divisionsOrigin"}>
              <div className = {"divisionsTopBar"}>
              <div className = {"seasonYear"}>Season: {season}</div>
              <div className = {"roundNumber"}>{day[0]} Round : {day[1]}</div>
              <div className = {"clock"}>
                {this.renderClock(this.state.matchTime)}
              </div>
            </div>
            <div>
              {(day[0] === "League") ? this.renderDivisions(matches, inds, day) : this.renderCup(matches, inds, day)}
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}