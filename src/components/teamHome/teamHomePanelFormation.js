import React from 'react';
import './teamHomePanelFormation.css'
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";

export default function TeamHomePanelFormation(props) {

    let disabled = true;
    const starters = props.players.filter(e=>e.starting === 1);
    const reserves = props.players.filter(e=>e.starting === 2);
    if(starters.length === 11 && reserves.length < 6 && !props.auto){
      if(starters.filter(e=>e.position === 'G').length === 1){
        disabled = false;
      }
    }

    const check = <IconContext.Provider value={{className: "teamHomePanelFormationGreenCheck"}}>
      <FaCheck />
    </IconContext.Provider>;
    
    return (
      <div className = {"teamHomePanelFormation"}>
        <button disabled={disabled ? 'disabled' : ''}> {check} Ready! </button>
      </div>
    );

}
