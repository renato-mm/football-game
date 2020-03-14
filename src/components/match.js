import React from 'react';
import './match.css';
import Attendance from './attendance';
import Team from './team';
import Scoreboard from './scoreboard';
import MatchStory from './matchStory';
import * as Teams from './teams';

export default class Match extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squarePos: 290,
    };
  }

  renderAttendance() {
    return (
      <Attendance />
    );
  }

  renderTeam(side, team) {
    return (
      <Team side = {side} team = {team}/>
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
  
  render(){
    return (
      <div
        className = {"matchBox"}
      >
        {this.renderAttendance()}
        {this.renderTeam("home", Teams.cruzeiro)}
        {this.renderScoreboard()}
        {this.renderTeam("away", Teams.atleticoMG)}
        {this.renderMatchStory()}
      </div>
    );
  }
}

