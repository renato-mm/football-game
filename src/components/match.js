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
      showHomeTeam: false,
      showAwayTeam: false,
      homeTeam: props.homeTeam,
      awayTeam: props.awayTeam,
      history: history,
      attendance: attendance,
      homeScore: 0,
      awayScore: 0,
      interval: setInterval(() => this.matchPlay(), 50),
      playCallBack : props.playCallBack,
      eventsProcessed: 0,
      timeBetweenEvents: 100,
    };
  }

  matchPlay() {
    let elapsedTime = this.state.playCallBack(false)
    if ( this.state.eventsProcessed < 90 && (this.state.eventsProcessed + 1) * this.state.timeBetweenEvents < elapsedTime ) {
      let newEventsProcessed = this.state.eventsProcessed + 1
      let newHistory = this.state.history.slice()
      let result = runMatch(this.state.homeTeam, this.state.awayTeam, newHistory, newEventsProcessed)
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

  renderModal(side) {
    let modal = null;
    if(side === "home" && this.state.showHomeTeam){
      const scoreboard = this.state.homeTeam.name+" "+this.state.homeScore+" - "+this.state.awayScore+" "+this.state.awayTeam.name;
      modal = <TeamModal team = {this.state.homeTeam} history = {this.state.history} score = {scoreboard} close = {() => this.switchModal("home")}/>;
    }
    else if(side === "away" && this.state.showAwayTeam){
      const scoreboard = this.state.homeTeam.name+" "+this.state.homeScore+" - "+this.state.awayScore+" "+this.state.awayTeam.name;
      modal = <TeamModal team = {this.state.awayTeam} history = {this.state.history} score = {scoreboard} close = {() => this.switchModal("away")}/>;
    }
    return modal;
  }

  renderTeam(side, team) {
    return (
      <Team side = {side} team = {team} teamClick = {() => this.switchModal(side)} />
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

  switchModal(side){
    //this.updateMatch(this.state.history);
    if(side === "home"){
      this.setState({showHomeTeam: !this.state.showHomeTeam,})
    }
    else if(side === "away"){
      this.setState({showAwayTeam: !this.state.showAwayTeam,})
    }
  }

  updateMatch(){
    const homeSc = (this.state.history.filter(e => e.stat === 'Goal' && e.teamID === this.state.homeTeam.id)).length;
    const awaySc = (this.state.history.filter(e => e.stat === 'Goal' && e.teamID === this.state.awayTeam.id)).length;
    this.setState({
      homeScore: homeSc,
      awayScore: awaySc
    });
    //clearInterval(this.state.interval);
  }
  
  render(){
    const matchStoryText = this.state.history[this.state.history.length - 1];
    return (
      <div className = {"matchBox"} >
        {this.renderAttendance(this.state.attendance)}
        {this.renderTeam("home", this.state.homeTeam)}
        {this.renderModal("home")}
        {this.renderScoreboard(this.state.homeScore, this.state.awayScore)}
        {this.renderTeam("away", this.state.awayTeam)}
        {this.renderModal("away")}
        {this.renderMatchStory(matchStoryText.time+"'  "+matchStoryText.stat+": "+matchStoryText.player)}
      </div>
    );
  }
}

