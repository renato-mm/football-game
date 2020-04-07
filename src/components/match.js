import React from 'react';
import './match.css';
import Attendance from './attendance';
import TeamModal from './teamModal';
import Scoreboard from './scoreboard';
import MatchStory from './matchStory';
import runMatch from './matchFunctions';

const attendance = 18500;
const history = [{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}]
  /*
  {time: 9,  stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 15, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2109', player:'Henrique'},
  {time: 16, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 25, stat:'CA', text: goalIcon, teamID:'atletico1906', playerID: '0609', player:'Pierre'},
  {time: 28, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2108', player:'Henrique'},
  {time: 33, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2113', player:'Marcelo Moreno'},
  {time: 35, stat:'CA', text: yellowCard, teamID:'atletico1906', playerID: '0602', player:'Júnior César'},
  {time: 44, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2104', player:'Egídio'},
  {time: 45, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2110', player:'Lucas Silva'},
  {time: 56, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2115', player:'Ricardo Goulart'},
  {time: 60, stat:'G',  text: goalIcon, teamID:'atletico1906', playerID: '0606', player:'Réver'},
  {time: 77, stat:'CV', text: redCard, teamID:'atletico1906', playerID: '0603', player:'Leonardo Silva'},
  {time: 77, stat:'CV', text: redCard, teamID:'cruzeiro1921', playerID: '2115', player:'Ricardo Goulart'},
  {time: 89, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2116', player:'Willian'}
  */

export default class Match extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      modalTeam: "",
      history: history,
      homeScore: 0,
      awayScore: 0,
      ind: this.props.matchInd,
    };
    this.handler = props.handler;
    this.homeTeam = props.homeTeam;
    this.awayTeam = props.awayTeam;
    this.attendance = attendance;
  }

  handleClose = () => this.setState({modalShow: false, modalTeam: "",});
  handleShow = (side) => this.setState({modalShow: true, modalTeam: side,});

  matchPlay() {
    let elapsedTime = this.state.playCallBack(false)
    if ( this.state.eventsProcessed < 90 && (this.state.eventsProcessed + 1) * this.state.timeBetweenEvents < elapsedTime ) {
      let newEventsProcessed = this.state.eventsProcessed + 1
      let newHistory = this.state.history.slice()
      let result = runMatch(this.handler, this.homeTeam, this.awayTeam, newHistory, newEventsProcessed)
      result.forEach(e => newHistory.push(e))
      this.setState( {eventsProcessed : newEventsProcessed, history : newHistory } )
    }
    if (this.state.eventsProcessed >= 90) {
      this.state.playCallBack(true)
      clearInterval(this.state.interval)
    }
  }

  renderAttendance(attend) {
    return (
      <Attendance attendance = {attend}/>
    );
  }

  renderTeam(side, team) {
    const  colors = {
      background: this.props.handler.get("Team", team, "color1"),
      color: this.props.handler.get("Team", team, "color2"),
    }
  
    return (
      <div
        style = {colors}
        className = {"team " + side}
        onClick = {() => this.handleShow(side)}
      >
        {this.props.handler.get("Team", team, "name")}
      </div>
    );
  }

  renderScoreboard(homeSc, awaySc) {
    return (
      <Scoreboard homeScore = {homeSc} awayScore = {awaySc}/>
    );
  }

  renderMatchStory(histText) {
    return (
      <MatchStory text = {histText}/>
    );
  }
  
  render(){
    let history = this.props.handler.get("Match", this.state.ind, "history")
    let homeID = this.props.handler.get("Match", this.state.ind, "home")
    let awayID = this.props.handler.get("Match", this.state.ind, "away")
    const homeSc = (history.filter(e => e.stat === 'Goal' && e.teamID === homeID)).length;
    const awaySc = (history.filter(e => e.stat === 'Goal' && e.teamID === awayID)).length;
    const matchStoryText = history[history.length - 1];
    //console.log(history, matchStoryText)
    const scoreboard = this.handler.get("Team", homeID, "name") + " " + homeSc + " - " + awaySc + " " + this.handler.get("Team", awayID, "name");
    return (
      <div className = {"matchBox"} >
        {this.renderAttendance(this.state.attendance)}
        {this.renderTeam("home", homeID)}
        {this.renderScoreboard(homeSc, awaySc)}
        {this.renderTeam("away", awayID)}
        {this.renderMatchStory(matchStoryText.time+"'  "+matchStoryText.stat+": "+matchStoryText.player)}
        <TeamModal
        handler={this.handler}
        team = {this.state.modalTeam === "home" ? homeID : awayID}
        history = {history}
        score = {scoreboard}
        show = {this.state.modalShow}
        handleClose = {this.handleClose}/>
      </div>
    );
  }
}

