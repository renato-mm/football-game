import React from 'react';
import './playerInfo.css'

export default function PlayerInfo(props){

  if(props.player === null)
    return null;

  const situation = props.handler.get("Player",props.player,"situation");
  const inj = (situation[0] === 3) ? <div> Injured for {situation[1]} matches </div> : null;
  const sus = (situation[0] === 4) ? <div> Suspended for {situation[1]} matches </div> : null;

  return (
    <div className = {"playerInfos"}>
      <table className = {"playerInfo"}>
        <tbody>
          <tr>
            <td>Behavior</td>
            <td>{props.handler.get("Player",props.player,"behaviour")}</td>
          </tr>
          <tr>
            <td>Goals this season</td>
            <td>{props.handler.get("Player",props.player,"goalsThisSeason")}</td>
          </tr>
        </tbody>
      </table>
      <table className = {"playerHistory"}>
        <thead>
          <td colSpan="2">History</td>
        </thead>
        <tbody>
          <tr>
            <td>Matches</td>
            <td>{props.handler.get("Player",props.player,"history")}</td>
          </tr>
          <tr>
            <td>Goals</td>
            <td>{props.handler.get("Player",props.player,"history")}</td>
          </tr>
          <tr>
            <td>Red Cards</td>
            <td>{props.handler.get("Player",props.player,"history")}</td>
          </tr>
          <tr>
            <td>Injuries</td>
            <td>{props.handler.get("Player",props.player,"history")}</td>
          </tr>
        </tbody>
      </table>
      <div className = {"row"}>
        <i><b>{inj}{sus}</b></i>
      </div>
    </div>
  );
  
}
