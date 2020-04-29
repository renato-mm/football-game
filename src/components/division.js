import React from 'react';
import './division.css';
import Match from './match';
import PieChart from 'react-minimal-pie-chart';

export default class Division extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matchesStarted: 0, // 0 = In between halves, 1 = Match playing, 2 = All matches completed
      startTime: 1,
      elapsedTime: 0,
      matchTime: 0,
      matchHalf: 1,
      paused: false,
    };
    this.handler = props.handler;
    this.buttonText = ["Start", "Playing", "Next Matches"]
  }

  handleKeyPress(event) {
    let key = event.key
    if (key === "p") {
      if (this.state.matchesStarted !== 1) {
        this.matchesButtonFunc()
      }
    }
  }

  matchesButtonFunc(event){
    if (this.state.matchesStarted === 0) { // Setup variables and start the ticker to call handler.runMatches
      this.matchesInterval = setInterval(() => this.matchPlay(), 50)
      let d = new Date()
      let t = d.getTime()
      this.setState( {matchesStarted: 1, startTime: t, matchTime: 0, paused: false} )
    } else if (this.state.matchesStarted === 1) { // Pause/Unpause game
      if (this.state.paused) {
        this.matchesInterval = setInterval(() => this.matchPlay(), 50)
        this.setState({paused: false})
      } else {
        this.setState({paused: true})
      }
    } else if (this.state.matchesStarted === 2) { // End the round
      this.props.handler.runMatches(false) // Warns handler that the game has finished playing the current matches
      this.setState( { matchesStarted : 0, elapsedTime: 0, matchTime: 0 } )
      this.props.matchesCallback("End") // Makes index.js switch screens
    }
  }

  pauseMatches(){
    this.setState({paused: true})
  }

  matchPlay(){
    let notice = this.handler.get("Match", 0, "notice")
    if (notice[0] !== "Nothing") {
      if (notice[0] === "Injury" || notice[0] === "Suspended") {
        let teamID = this.handler.get("Player", notice[1], "teamID")
        this.pauseMatches() // PLACEHOLDER
        // Call teamID substitution window  //this.pauseMatches()//notice[1]
        return
      }
    }
    if (this.state.paused) {clearInterval(this.matchesInterval); return}
    if (this.state.matchesStarted === 1) {
      let matchesDone = this.props.handler.runMatches() // returns list [matchtime = int, half done = bool, matches done = bool, half name = string]
      let d = new Date()
      let t = d.getTime()
      let elapsedTime = t - this.state.startTime
      this.setState( {elapsedTime: elapsedTime, matchTime: matchesDone[0], matchHalf: matchesDone[3]} )
      if (matchesDone[1]) {
        clearInterval(this.matchesInterval)
        if (!matchesDone[2]) {
          this.setState( { matchesStarted : 0 } ) 
        } else {
          this.setState( { matchesStarted : 2 } ) // All matches are done and everythings stops and waits for player to press button and confirm to finish the round
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
      matchInd = {ind}
      pauseMatches = {() => {this.pauseMatches()}}/>
    );
  }

  renderClock(time) {
    let halfTime = 45
    let maxTime = 60
    if (this.state.matchHalf >= 3) {maxTime = 30; halfTime = 15}
    let extraTime = (time > halfTime) ? time - halfTime : 0
    return (<PieChart
                data={[
                  { title: 'Time', value: time - extraTime, color: 'blue' },
                  { title: 'ExtraTime', value: extraTime, color: 'red' },
                  { title: '', value: maxTime - time, color: 'white' },
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

  renderMatches() {
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
    let colors = {
      background: "#000",
      color: "#0F0",
      fontWeight: "bold",
    }
    let buttonText = "Start/Pause"
    let halvesNames = ["NONE", "First Half", "Second Half", "First Extra Half", "Second Extra Half"]
    if (this.state.matchesStarted === 0) {buttonText = "Start " + halvesNames[this.state.matchHalf]}
    else if (this.state.matchesStarted === 1) {buttonText = ((this.state.paused) ? "Resume" : "Pause")}
    else if (this.state.matchesStarted === 2) {buttonText = "Finish"}     
    return (
      <div className = {"matchesBox"}>
        <div className = {"divisionsTopBar"}>
          <div className = {"seasonYear"}>Season: {season}</div>
          <div className = {"roundNumber"}>{day[0]} Round : {day[1]}</div>
          <button 
            className = {"finishButton"} 
            style = {colors}
            onClick = {() => this.matchesButtonFunc()}
            > 
            {buttonText}
          </button>
          <div className = {"clock"}> {this.renderClock(this.state.matchTime)} </div>
        </div>
        {(day[0] === "League") ? this.renderDivisions(matches, inds, day) : this.renderCup(matches, inds, day)}
      </div>
    )
  }
  
  render(){        
    return (
      <div className = {"matchesOrigin"} onKeyDown = {(event) => this.handleKeyPress(event)} tabIndex = "0">
        <div className = {"matchesBoard"}>
          {this.renderMatches()}
        </div>
      </div>
    );
  }
}