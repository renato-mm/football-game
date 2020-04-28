import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './teamModal.css';
import { IconContext } from "react-icons";
import { GiSoccerBall } from "react-icons/gi";
import { GiWhistle } from "react-icons/gi";
import {AiTwotoneBook} from "react-icons/ai";

const goalIcon = <GiSoccerBall />;
const whistle = <GiWhistle />;
const redCard = <IconContext.Provider value={{className: "redCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;

export default function TeamModal(props) {

  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [selectedReserve, setSelectedReserve] = React.useState(null);

  const selectPlayer = (player, bench) => {
    bench === 1 ? setSelectedPlayer(player) : setSelectedReserve(player);
  }

  const clearSelected = () => {
    setSelectedPlayer(null);
    setSelectedReserve(null);
  }
  
  const colors = {
    background: props.handler.get("Team",props.team,"color1"),
    color: props.handler.get("Team",props.team,"color2"),
  };

  const plysID = props.handler.get("Team",props.team,"players");
  const teamPlys = plysID.filter(e=>(props.handler.get("Player",e,"situation")[0]<3));
  const subs = props.handler.get("Match", teamPlys[0], "sub");
  const players = [];
  const reserves = [];

  ['G','D','M','F'].forEach(pos => {
    const plys = teamPlys.filter(e=>props.handler.get("Player",e,"position") === pos);
    plys.sort((e1,e2)=>props.handler.get("Player",e1,"name")>props.handler.get("Player",e2,"name"));
    for(let j = 0; j < plys.length; j++){
      let html = <tr
                  key={plys[j]}
                  className={(plys[j]===selectedPlayer || plys[j]===selectedReserve) ? "teamModalSelected" : "" }
                  onClick={() => selectPlayer(plys[j], props.handler.get("Player",plys[j],"situation")[0])}>
                  <td>{props.handler.get("Player",plys[j],"position")}</td>
                  <td>&nbsp;{props.handler.get("Player",plys[j],"name")}&nbsp;</td>
                  <td>{props.handler.get("Player",plys[j],"strength")}</td>
                </tr>;
      if(props.handler.get("Player",plys[j],"situation")[0] === 1){
        players.push(html);
      }
      else if(props.handler.get("Player",plys[j],"situation")[0] === 2){
        reserves.push(html);
      }
    }
  });

  const hist = [];
  let homeSc = 0;
  let awaySc = 0;
  for(let j = 0; j < props.history.length; j++){
    let stat = '';
    switch(props.history[j].text){
      case "Goal":
        stat = goalIcon;
        props.history[j].teamID === props.homeID ? homeSc++ : awaySc++;
        break;
      case "Match Start":
        stat = whistle;
        break;
      default:
        stat = props.history[j].text;
    }
    hist.push(
      <tr key={j}>
        <td>{props.history[j].time.toString().padStart(2, '0')}'&nbsp;</td>
        <td>{homeSc}&nbsp;:&nbsp;{awaySc}&nbsp;</td>
        <td>{stat}&nbsp;</td>
        <td>{props.history[j].player}</td>
      </tr>);
  }

  const switchPlayers = (movingOut,movingIn) => {
    if (movingOut === 0 || movingIn === 0) {return}

    let movingOutSit = props.handler.get("Player", movingOut, "situation")
    movingOutSit[0] = 0
    props.handler.set("Player", movingOut, "situation", movingOutSit)

    let movingInSit = props.handler.get("Player", movingIn, "situation")
    movingInSit[0] = 1
    props.handler.set("Player", movingIn, "situation", movingInSit)

    props.handler.set("Match", movingIn, "sub", 1)

    clearSelected();
  }

  const isHuman = props.handler.get("Team", props.team, "is human");
  const disabled = (subs >= 3 || !isHuman) ? "disabled" : '';
  const subButton = !isHuman ? null :
  <button onClick={()=>switchPlayers(selectedPlayer,selectedReserve)} disabled={disabled}><b>Substitute</b></button>;

  return (
    <Modal show={props.show} onHide={()=>{clearSelected();props.handleClose()}} animation={false} centered>
      <Modal.Body>
        <div
          style = {colors}
          className = {"teamModal"}
        >
          <div className = {"teamModalHeader"}>
            <b>{props.score}</b>
            </div>
          <table className = {"teamModalHistoryTable"}>
            <tbody>
              {hist}
            </tbody>
          </table>
          <b>{props.handler.get("Team",props.team,"name")}</b>
          <div className = {"teamModalPlayers"}>
            <table className = {"teamModalPlayersTable"}>
              <tbody>
                {players}
              </tbody>
            </table>
            <table className = {"teamModalReservesTable"}>
              <tbody>
                {reserves}
              </tbody>
            </table>
            <div className = {"teamModalSubButton"}>
              {subButton}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
