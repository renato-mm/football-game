import React from 'react';
import './teamHomePanelPlayer.css'
import countryInfo from "../countryFunctions";

export default function TeamHomePanelPlayer(props){

  if(props.player === null)
    return null;

  const inj = (props.player.injured > 0) ? <div> Injured for {props.player.injured} matches </div> : null;
  const sus = (props.player.suspended > 0) ? <div> Suspended for {props.player.suspended} matches </div> : null;

  const countryInfos = countryInfo(props.player.nationality);

  return (
    <div>
      <div className = {"row teamHomePanelPlayer"}>
        <div> <span>{props.player.name}</span> </div>
        <div> {countryInfos[1]} {countryInfos[0]} </div>
      </div>
      <table className = {"teamHomePanelPlayerInfo"}>
        <tbody>
          <tr>
            <td>Behavior</td>
            <td>{props.player.behavior}</td>
          </tr>
          <tr>
            <td>Goals this season</td>
            <td>{props.player.seasonGoals}</td>
          </tr>
        </tbody>
      </table>
      <table className = {"teamHomePanelPlayerHistory"}>
        <thead>
          <td colSpan="2">History</td>
        </thead>
        <tbody>
          <tr>
            <td>Matches</td>
            <td>{props.player.matches}</td>
          </tr>
          <tr>
            <td>Goals</td>
            <td>{props.player.goals}</td>
          </tr>
          <tr>
            <td>Red Cards</td>
            <td>{props.player.redCards}</td>
          </tr>
          <tr>
            <td>Injuries</td>
            <td>{props.player.injuries}</td>
          </tr>
        </tbody>
      </table>
      <div className = {"row"}>
        <i><b>{inj}{sus}</b></i>
      </div>
      <div className = {"row"}>
        <button className = {"teamHomePanelContract"}>
          Renew Contract
        </button>
      </div>
    </div>
  );
  
}
