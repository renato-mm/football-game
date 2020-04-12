import React from 'react';
import './teamHomePanelFormation.css'
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";

export default function TeamHomePanelFormation(props) {

    let disabled = true;
    let starters = props.players.filter(e=>props.handler.get("Player",e,"situation")[0] === 1);
    let reserves = props.players.filter(e=>props.handler.get("Player",e,"situation")[0] === 2);
    let keepers = starters.filter(e=>props.handler.get("Player",e,"position") === 'G');
    if(starters.length === 11 && reserves.length < 8 && !props.auto){
      if(keepers.length === 1){
        disabled = false;
      }
    }

    const check = <IconContext.Provider value={{className: "teamHomePanelFormationGreenCheck"}}>
      <FaCheck />
    </IconContext.Provider>;
    
    return (
      <div className = {"teamHomePanelFormation"}>
        <button onClick={props.ready} disabled={disabled ? 'disabled' : ''}> {check} Ready! </button>
      </div>
    );

}
