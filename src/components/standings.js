import React from 'react';
import './standings.css';

export default function Standings(props) {

  const division1 = divisionRows(props.handler, 1);
  const division2 = divisionRows(props.handler, 2);
  const division3 = divisionRows(props.handler, 3);
  const division4 = divisionRows(props.handler, 4);

  return (
    <div className = {"standings"} >
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          <tbody>
            {division1}
          </tbody>
        </table>
        <table className = {"standingsTable"}>
          <tbody>
            {division2}
          </tbody>
        </table>
      </div>
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          <tbody>
            {division3}
          </tbody>
        </table>
        <table className = {"standingsTable"}>
          <tbody>
            {division4}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function divisionRows(handler, divisionID){

  const teams = handler.get("League", divisionID, "teams");

  const division = [];
  for(let j = 0; j < teams.length; j++){
    const standing = handler.get("Team", teams[j], "standing");
    const colors = {
      background: handler.get("Team", teams[j], "color1"),
      color: handler.get("Team", teams[j], "color2"),
    };
    division.push(
      <tr key={teams[j]} style={colors}>
        <td><b>{handler.get("Team", teams[j], "name")}</b></td>
        <td>{standing[1]}</td>
        <td>{standing[2]}</td>
        <td>{standing[3]}</td>
        <td>{standing[4]}&nbsp;:&nbsp;{standing[5]}</td>
        <td>{standing[6]}</td>
      </tr>);
  }

  return division;
}
