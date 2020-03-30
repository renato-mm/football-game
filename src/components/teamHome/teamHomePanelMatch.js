import React from 'react';
import './teamHomePanelMatch.css'

export default function TeamHomePanelMatch(props){

  const headToHead = [];
  headToHead.push(
  <tbody>
    <tr style={props.colors}>
      <td>{props.teamStandings.team}</td>
      <td>&nbsp;{props.teamStandings.wins}&nbsp;</td>
      <td>&nbsp;{props.teamStandings.draws}&nbsp;</td>
      <td>&nbsp;{props.teamStandings.losses}&nbsp;</td>
      <td>&nbsp;{props.teamStandings.goalsFor}&nbsp;:&nbsp;{props.teamStandings.goalsAgainst}&nbsp;</td>
      <td>{props.teamStandings.points}</td>
    </tr>
    <tr style={props.oppColors}>
      <td>{props.opponnentStandings.team}</td>
      <td>&nbsp;{props.opponnentStandings.wins}&nbsp;</td>
      <td>&nbsp;{props.opponnentStandings.draws}&nbsp;</td>
      <td>&nbsp;{props.opponnentStandings.losses}&nbsp;</td>
      <td>&nbsp;{props.opponnentStandings.goalsFor}&nbsp;:&nbsp;{props.opponnentStandings.goalsAgainst}&nbsp;</td>
      <td>{props.opponnentStandings.points}</td>
    </tr>
  </tbody>);

  return (
    <div>
      <div className = {"row"}>
        <table className = {"teamHomeHeadToHead"}>
          {headToHead}
        </table>
      </div>
      <div className = {"row"}>
        <div className = {"teamHomeLastHeadtoHead"}>
          Last head to head <span> <b>W/D/L 0:0 (year)</b> </span>
        </div>
      </div>
      <div className = {"row teamHomeCash"}>
        <div> Cash </div>
        <div> {props.cash} </div>
      </div>
      <div className = {"row teamHomeMoral"}>
        <div> Moral </div>
        <div> {props.moral} </div>
      </div>
    </div>
  );
  
}
