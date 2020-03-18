import React from 'react';
import './scoreboard.css';

export default function Scoreboard(props) {  
  return (
    <div className = {"scoreboard"}>
      <div className = {"leftScoreboard"} > <b>{props.homeScore}</b> &nbsp;</div>
      <div className = {"rightScoreboard"} > <b>{props.awayScore}</b> </div>
    </div>
  );
}