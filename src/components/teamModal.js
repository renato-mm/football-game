import React from 'react';
import './teamModal.css';
import { IconContext } from "react-icons";
import { FaRegWindowClose } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import {AiTwotoneBook} from "react-icons/ai";

const goalIcon = <GiSoccerBall />;
const yellowCard = <IconContext.Provider value={{className: "yellowCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;
const redCard = <IconContext.Provider value={{className: "redCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;
const closeIcon = <FaRegWindowClose />;

export default function TeamModal(props) {
  if(props.show === false){
    return null;
  }

  const colors = {
    background: props.team.color1,
    color: props.team.color2,
  };

  const teamPlys = props.team.players.filter(e=>e.injured === 0 && e.suspended === 0);
  const players = [];
  const reserves = [];

  ['G','D','M','F'].forEach(pos => {
    const plys = teamPlys.filter(e=>e.position === pos);
    plys.sort((e1,e2)=>e1.name>e2.name);
    for(let j = 0; j < plys.length; j++){
      let html = <tr>
                  <td>{plys[j].position}</td>
                  <td>&nbsp;{plys[j].name}&nbsp;</td>
                  <td>{plys[j].power}</td>
                </tr>;
      if(plys[j].starting === 1){
        players.push(html);
      }
      else if(plys[j].starting === 2){
        reserves.push(html);
      }
    }
  });

  const hist = []
  for(let j = 0; j < props.history.length; j++){
    hist.push(
      <tr>
        <td>{props.history[j].time.toString().padStart(2, '0')}'</td>
        <td>&nbsp;{props.history[j].text}&nbsp;</td>
        <td>{props.history[j].player}</td>
      </tr>);
  }

  return (
    <div
      style = {colors}
      className = {"teamModal"}
    >
      <div className = {"teamModalHeader"}>
        <b>{props.score}</b>
        <div className = {"teamModalCloseButton"} onClick = { props.close }>{closeIcon}</div>
      </div>
      <table className = {"teamModalHistoryTable"}>
        <tbody>
          {hist}
        </tbody>
      </table>
      <b>{props.team.name}</b>
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
        <button className = {"teamModalSubButton"}><b>Substitute</b></button>
      </div>
    </div>
  );
}
