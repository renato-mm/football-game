import React from 'react';
import './teamHomePanelMatch.css'
import ProgressBar from 'react-bootstrap/ProgressBar'

export default function TeamHomePanelMatch(props){

  const teamStandings = props.handler.get("Team",props.team,"standing");
  const opponentStandings = props.handler.get("Team",props.opponent,"standing");

  const headToHead = [];
  headToHead.push(
  <tbody key={"standings"}>
    <tr key={"teamStandings"} style={props.colors}>
      <td>{props.handler.get("Team",props.team,"name")}</td>
      <td>&nbsp;{teamStandings[1]}&nbsp;</td>
      <td>&nbsp;{teamStandings[2]}&nbsp;</td>
      <td>&nbsp;{teamStandings[3]}&nbsp;</td>
      <td>&nbsp;{teamStandings[4]}&nbsp;:&nbsp;{teamStandings[5]}&nbsp;</td>
      <td>{teamStandings[6]}</td>
    </tr>
    <tr key={"opponentStandings"} style={props.oppColors}>
      <td>{props.handler.get("Team",props.opponent,"name")}</td>
      <td>&nbsp;{opponentStandings[1]}&nbsp;</td>
      <td>&nbsp;{opponentStandings[2]}&nbsp;</td>
      <td>&nbsp;{opponentStandings[3]}&nbsp;</td>
      <td>&nbsp;{opponentStandings[4]}&nbsp;:&nbsp;{opponentStandings[5]}&nbsp;</td>
      <td>{opponentStandings[6]}</td>
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
