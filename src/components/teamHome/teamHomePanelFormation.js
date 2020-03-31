import React from 'react';
import './teamHomePanelFormation.css'

export default function TeamHomePanelFormation(props) {

    let disabled = true;
    const starters = props.players.filter(e=>e.starting === 1);
    const reserves = props.players.filter(e=>e.starting === 2);
    if(starters.length === 11 && reserves.length < 6 && !props.auto){
      if(starters.filter(e=>e.position === 'G').length === 1){
        disabled = false;
      }
    }

    
    return (
      <div className = {"teamHomePanelFormation"}>
        <button disabled={disabled ? 'disabled' : ''}> Ready! </button>
      </div>
    );

}
