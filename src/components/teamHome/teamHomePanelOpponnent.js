import React from 'react';
import './teamHomePanelOpponnent.css'
import ProgressBar from 'react-bootstrap/ProgressBar'

export default function TeamHomePanelOpponnent(props){

  const oppColors = {
    background: props.opponnent.color1,
    color: props.opponnent.color2,
  };

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
      <div style={oppColors} className = {"row teamHomePanelOpponnentName"}>
        <span>{props.opponnent.name}</span>
      </div>
      <div className = {"row teamHomeOpponnentMoralBar"}>
        <ProgressBar variant={moralColor(props.opponnent.moral)} now={props.opponnent.moral} />
      </div>
      <div className = {"row teamHomeOpponnentCoach"}>
        Coach <span>{props.opponnent.coach}</span>
      </div>
      <div className = {"row teamHomeOpponnentButtons"}>
        <button> Fixtures </button>
        <button onClick={()=>props.showOpponnentInfo()}> Rooster </button>
      </div>
    </div>
  );
  
}
