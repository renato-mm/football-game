import React from 'react';
import './teamHomePanelFormation.css'
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";

export default function TeamHomePanelFormation(props) {

    let disabled = true;
    let starters = 0;//props.players.filter(e=>e.starting === 1);
    let reserves = 0;//props.players.filter(e=>e.starting === 2);
    let keepers = 0;
    for(let j = 0; j < props.players.length; j++){
      switch(props.handler.get("Player",props.players[j],"situation")[0]){
        case 1:
          if(props.handler.get("Player",props.players[j],"position"))
            keepers++;
          starters++;
          break;
        case 2:
          reserves++;
          break;
        default:
      }
    }
    if(starters === 11 && reserves < 6 && !props.auto){
      if(keepers === 1){
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
