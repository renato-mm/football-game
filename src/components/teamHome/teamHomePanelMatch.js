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

  const h2h = props.headToHead;
  let h2hText = '';
  if(h2h && h2h[9]){
    const cup = h2h[5] === 'League' ? 0 : 1;
    const home = h2h[0] === props.team ? "Home" : "Away";
    const fixture = !cup ? h2h[5]+" - Division "+h2h[6] : h2h[5]+" - "+h2h[6];
    const h2hResult = h2h[4] === 0 ? 'D' : h2h[4] === props.team ? 'W' : 'L';
    const homeName = props.handler.get("Team",h2h[0],"name");
    const awayName = props.handler.get("Team",h2h[1],"name");
    h2hText = <>{fixture+" ("+h2h[8]+"):"}<br/>{home}&nbsp;&nbsp;{homeName}&nbsp;&nbsp;{h2h[2]+":"+h2h[3]}&nbsp;&nbsp;{awayName}&nbsp;&nbsp;{h2hResult}</>;
  }
  else{
    h2hText = <>{'First match between them!'}<br/></>;
  }

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
          Last head to head <div> <b>{h2hText}</b> </div>
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
