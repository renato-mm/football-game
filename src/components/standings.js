import React from 'react';
import './standings.css';

export default function Standings(props) {

  const division1 = [];

  for(let j = 0; j < props.division1.length; j++){
    const colors = {
      background: props.division1[j].color1,
      color: props.division1[j].color2,
    };
    division1.push(
      <tr style={colors}>
        <td>{props.division1[j].team}</td>
        <td>&nbsp;{props.division1[j].wins}&nbsp;</td>
        <td>&nbsp;{props.division1[j].draws}&nbsp;</td>
        <td>&nbsp;{props.division1[j].losses}&nbsp;</td>
        <td>&nbsp;{props.division1[j].goalsFor}&nbsp;:&nbsp;{props.division1[j].goalsAgainst}&nbsp;</td>
        <td>{props.division1[j].points}</td>
      </tr>);
  }

  return (
    <div className = {"standings"} >
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          {division1}
        </table>
        <table className = {"standingsTable"}>
          {division1}
        </table>
      </div>
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          {division1}
        </table>
        <table className = {"standingsTable"}>
          {division1}
        </table>
      </div>
    </div>
  );
}
