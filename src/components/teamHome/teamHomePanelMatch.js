import React from 'react';
import './teamHomePanelMatch.css'
import ProgressBar from 'react-bootstrap/ProgressBar'

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

  const cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: "name",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  const moralColor = (moral) => {
    if(moral > 60){
      return 'success';
    }
    else if(moral > 30){
      return "warning";
    }
    else{
      return "danger";
    }
  }

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
        <div> {cashFormat(props.cash)} </div>
      </div>
      <div className = {"row teamHomeMoral"}>
        Moral
        <div> <ProgressBar className = {"teamHomeMoralBar"} variant={moralColor(props.moral)} now={props.moral} /> </div>
      </div>
    </div>
  );
  
}
