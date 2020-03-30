import React from 'react';
import './teamHomePanelPlayer.css'

export default function TeamHomePanelPlayer(props){

  if(props.player === null)
    return null;

  return (
    <div>
      <div className = {"row teamHomePanelPlayer"}>
        <div> <span>{props.player.name}</span> </div>
        <div> Flag {props.player.nationality} </div>
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
      History
      <table className = {"teamHomePanelPlayerHistory"}>
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
        <button className = {"teamHomePanelContract"}>
          Renew Contract
        </button>
      </div>
    </div>
  );
  
}
