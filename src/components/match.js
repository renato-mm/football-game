import React from 'react';
import './match.css';
import Attendance from './attendance';
import Team from './team';
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
      interval: setInterval(() => this.matchPlay(), 50),
      playCallBack : props.playCallBack,
      eventsProcessed: 0,
      timeBetweenEvents: 100,
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
    this.updateMatch()

  }

  renderAttendance(attend) {
    return (
      <Attendance attendance = {attend}/>
    );
  }

  renderTeam(side, team) {
    return (
      <Team
      handler = {this.handler}
      side = {side}
      team = {team}
      handleShow = {() => this.handleShow(side)} />
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

  updateMatch(){
    const homeSc = (this.state.history.filter(e => e.stat === 'Goal' && e.teamID === this.handler.get("Team",this.homeTeam,"id"))).length;
    const awaySc = (this.state.history.filter(e => e.stat === 'Goal' && e.teamID === this.handler.get("Team",this.awayTeam,"id"))).length;
    this.setState({
      homeScore: homeSc,
      awayScore: awaySc
    });
    //clearInterval(this.state.interval);
  }
  
  render(){
    const matchStoryText = this.state.history[this.state.history.length - 1];
    const scoreboard = this.handler.get("Team",this.homeTeam,"name")+" "+this.state.homeScore+" - "+this.state.awayScore+" "+this.handler.get("Team",this.awayTeam,"name");
    return (
      <div className = {"matchBox"} >
        {this.renderAttendance(this.state.attendance)}
        {this.renderTeam("home", this.homeTeam)}
        {this.renderScoreboard(this.state.homeScore, this.state.awayScore)}
        {this.renderTeam("away", this.awayTeam)}
        {this.renderMatchStory(matchStoryText.time+"'  "+matchStoryText.stat+": "+matchStoryText.player)}
        <TeamModal
        handler={this.handler}
        team = {this.state.modalTeam === "home" ? this.homeTeam : this.awayTeam}
        history = {this.state.history}
        score = {scoreboard}
        show = {this.state.modalShow}
        handleClose = {this.handleClose}/>
      </div>
    );
  }
}

