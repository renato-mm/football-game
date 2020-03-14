import React from 'react';
import './match.css';
import Attendance from './attendance';
import Team from './team';
import Scoreboard from './scoreboard';
import MatchStory from './matchStory';
import * as Teams from './teams';

function TeamModal(props) {
  if(props.show === false){
    return null;
  }

  const colors = {
    background: props.team.color1,
    color: props.team.color2,
  };

  const plys = props.team.players;
  const players = [];
  for(let j = 0; j < plys.length; j++){
    players.push(<div>{plys[j].position}&nbsp;&nbsp;{plys[j].name}&nbsp;{plys[j].power}</div>);
  }

  return (
    <div
      style = {colors}
      className = {"teamModal"}
      onClick = { props.close }
    >
      <b>{props.team.name}</b>
      <div class = {"teamModalPlayers"}>
        {players}
      </div>
    </div>
  );
}

export default class Match extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showHomeTeam: false,
      showAwayTeam: false,
      homeTeam: Teams.cruzeiro,
      awayTeam: Teams.atleticoMG
    };
  }

  renderAttendance() {
    return (
      <Attendance />
    );
  }

  renderModal(side, team) {
    return (
      <Team side = {side} team = {team} />
    );
  }

  renderTeam(side, team) {
    return (
      <Team side = {side} team = {team} teamClick = {() => this.switchModal(side)} />
    );
  }

  renderScoreboard() {
    return (
      <Scoreboard />
    );
  }

  renderMatchStory() {
    return (
      <MatchStory />
    );
  }

  switchModal(side){
    if(side === "home"){
      this.setState({showHomeTeam: !this.state.showHomeTeam,})
    }
    else if(side === "away"){
      this.setState({showAwayTeam: !this.state.showAwayTeam,})
    }
  }
  
  render(){
    const homeTeam = this.state.showHomeTeam ? <TeamModal team = {this.state.homeTeam} close = {() => this.switchModal("home")}/> : null;
    const awayTeam = this.state.showAwayTeam ? <TeamModal team = {this.state.awayTeam} close = {() => this.switchModal("away")}/> : null;
    return (
      <div
        className = {"matchBox"}
      >
        {this.renderAttendance()}
        {this.renderTeam("home", Teams.cruzeiro)}
        {homeTeam}
        {this.renderScoreboard()}
        {this.renderTeam("away", Teams.atleticoMG)}
        {awayTeam}
        {this.renderMatchStory()}
      </div>
    );
  }
}

