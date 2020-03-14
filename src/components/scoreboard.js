import React from 'react';
import './scoreboard.css';

export default function Scoreboard(props) {  
  return (
    <div className = {"scoreboard"}>
      <div className = {"leftScoreboard"} > <b>6</b> &nbsp;</div>
      <div className = {"rightScoreboard"} > <b>1</b> </div>
    </div>
  );
}