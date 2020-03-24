import React from 'react';
import './teamHome.css';
import { GoPrimitiveDot } from "react-icons/go";
import { GoDash } from "react-icons/go";

export default function TeamHome(props) {

  const colors = {
    background: props.team.color1,
    color: props.team.color2,
  };
  const colorsPlayers = {
    background: props.team.color2,
    color: props.team.color1,
  };
  const starter = <GoPrimitiveDot />;
  const reserve = <GoDash />;
  const oppColors = {
    background: props.opponnent.color1,
    color: props.opponnent.color2,
  };

  const teamPlayers = [];
  for(let j = 0; j < props.team.players.length; j++){
    const nat = props.team.players[j].nationality === props.team.nationality ? ' ' : props.team.players[j].nationality;
    teamPlayers.push(
      <tr>
        <td>{props.team.players[j].starting ? starter : reserve}</td>
        <td>&nbsp;<b>{props.team.players[j].position}</b></td>
        <td>&nbsp;<b>{props.team.players[j].name}</b>&nbsp;</td>
        <td>&nbsp;<b>{props.team.players[j].power}</b>&nbsp;</td>
        <td>&nbsp;<b>{nat}</b>&nbsp;</td>
        <td>&nbsp;<b>{props.team.players[j].salary}</b>&nbsp;</td>
        <td><b>{props.team.players[j].salaryRenewed ? '+' : ' '}</b></td>
      </tr>);
  }

  const headToHead = [];
  headToHead.push(
  <tr style={colors}>
    <td>{props.team.name}</td>
    <td>&nbsp;{props.teamStandings.wins}&nbsp;</td>
    <td>&nbsp;{props.teamStandings.draws}&nbsp;</td>
    <td>&nbsp;{props.teamStandings.losses}&nbsp;</td>
    <td>&nbsp;{props.teamStandings.goalsFor}&nbsp;:&nbsp;{props.teamStandings.goalsAgainst}&nbsp;</td>
    <td>{props.teamStandings.points}</td>
  </tr>);
  headToHead.push(
  <tr style={oppColors}>
    <td>{props.opponnent.name}</td>
    <td>&nbsp;{props.opponnentStandings.wins}&nbsp;</td>
    <td>&nbsp;{props.opponnentStandings.draws}&nbsp;</td>
    <td>&nbsp;{props.opponnentStandings.losses}&nbsp;</td>
    <td>&nbsp;{props.opponnentStandings.goalsFor}&nbsp;:&nbsp;{props.opponnentStandings.goalsAgainst}&nbsp;</td>
    <td>{props.opponnentStandings.points}</td>
  </tr>);

  return (
    <div style={colors} className = {"teamHome"} >
      <div className = {"teamHomeHeader"}>
        <b>Team Full Name</b>
      </div>
      <div className = {"teamHomeMenu"}>
        <button>Freefoot</button>
        <button>Formation</button>
        <button>Team</button>
        <button>Player</button>
        <button>Championship</button>
        <button>Coach</button>
      </div>
      <div className = {"row col-md-12"}>
        <div className = {"col-md-6"}>
          <div className = {"row"}> Coach name </div>
          <div className = {"row"}>
            <div>Team's Country Flag |&nbsp;</div>
            <div>Team's Division</div>
          </div>
          <div className = {"row"}>
            <table style={colorsPlayers} className = {"teamHomePlayers"}>
              {teamPlayers}
            </table>
          </div>
        </div>
        <div className = {"col-md-6"}>
          <div className = {"row nextMatch"}> Next Match <span>Current Year</span></div>
          <div style={oppColors} className = {"row nextMatchInfo"}> {props.opponnent.name} <div>HOME - Fixture #4</div></div>
          <div className = {"row"}>
            <table className = {"teamHomeHeadToHead"}>
              {headToHead}
            </table>
          </div>
          <div className = {"row"}>
          </div>
        </div>
      </div>
    </div>
  );
}
