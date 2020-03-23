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

  const teamPlys = props.team.players;
  const players = [];
  const reserves = [];

  [['G',1],['D',4],['M',3],['A',3]].forEach(pos => {
    const plys = teamPlys.filter(e=>e.position === pos[0]);
    plys.sort((e1,e2)=>e1.power<e2.power);
    for(let j = 0; j < pos[1]; j++){
      players.push(
        <tr>
          <td>{plys[j].position}</td>
          <td>&nbsp;{plys[j].name}&nbsp;</td>
          <td>{plys[j].power}</td>
        </tr>);
    }
    for(let j = pos[1]; j < plys.length; j++){
      reserves.push(
        <tr>
          <td>{plys[j].position}</td>
          <td>&nbsp;{plys[j].name}&nbsp;</td>
          <td>{plys[j].power}</td>
        </tr>);
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
        {hist}
      </table>
      <b>{props.team.name}</b>
      <div className = {"teamModalPlayers"}>
        <table className = {"teamModalPlayersTable"}>
          {players}
        </table>
        <table className = {"teamModalReservesTable"}>
          {reserves}
        </table>
        <button className = {"teamModalSubButton"}><b>Substitute</b></button>
      </div>
    </div>
  );
}
