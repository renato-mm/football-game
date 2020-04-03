import React from 'react';
import './teamHomePanelPlayer.css'
import countryInfo from "../countryFunctions";
import PlayerInfo from './playerInfo';

export default function TeamHomePanelPlayer(props){

  if(props.player === null)
    return null;

  const countryInfos = countryInfo(props.player.nationality);

  return (
    <div>
      <div className = {"row teamHomePanelPlayer"}>
        <div> <span>{props.player.name}</span> </div>
        <div> {countryInfos[1]} {countryInfos[0]} </div>
      </div>
      <PlayerInfo player={props.player}/>
      <div className = {"row"}>
        <button className = {"teamHomePanelContract"}
                onClick={()=>props.changePanel("newSalary")}
                disabled={props.player.salaryRenewed ? "disabled" : ''}>
          Renew Contract
        </button>
      </div>
    </div>
  );
  
}
