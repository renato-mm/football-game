import React from 'react';
import './teamHomePanelOpponent.css'
import ProgressBar from 'react-bootstrap/ProgressBar'
import FixturesInfo from './fixturesInfo';

export default function TeamHomePanelOpponent(props){

  const [oppFixturesModalShow, setOppFixturesModalShow] = React.useState(false);

  const handleClose = () => setOppFixturesModalShow(false);
  const handleShow = () => setOppFixturesModalShow(true);

  const oppColors = {
    background: props.handler.get("Team",props.opponent,"color1"),
    color: props.handler.get("Team",props.opponent,"color2"),
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
    <>
      <div style={oppColors} className = {"row teamHomePanelOpponentName"}>
        <span>{props.handler.get("Team",props.opponent,"name")}</span>
      </div>
      <div className = {"row teamHomeOpponentMoralBar"}>
        <ProgressBar variant={moralColor(props.handler.get("Team",props.opponent,"moral"))} now={props.handler.get("Team",props.opponent,"moral")} />
      </div>
      <div className = {"row teamHomeOpponentCoach"}>
        Coach <span>{props.handler.get("Player",props.handler.get("Team",props.opponent,"coach"),"name")}</span>
      </div>
      <div className = {"row teamHomeOpponentButtons"}>
        <button onClick={handleShow}> Fixtures </button>
        <button onClick={()=>props.showOpponentInfo()}> Roster </button>
      </div>
      <FixturesInfo
      handler={props.handler}
      team={props.opponent}
      handleClose={handleClose}
      show={oppFixturesModalShow}/>
    </>
  );
  
}
