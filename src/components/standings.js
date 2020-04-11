import React from 'react';
import './standings.css';

export default function Standings(props) {

  const division1 = divisionRows(props.handler, 1, props.showTeamInfo);
  const division2 = divisionRows(props.handler, 2, props.showTeamInfo);
  const division3 = divisionRows(props.handler, 3, props.showTeamInfo);
  const division4 = divisionRows(props.handler, 4, props.showTeamInfo);

  return (
    <div className = {"standings"} >
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          <thead>
            <tr>
              <td colSpan="8">Division 1</td>
            </tr>
          </thead>
          <tbody>
            {division1}
          </tbody>
        </table>
        <table className = {"standingsTable"}>
          <thead>
            <tr>
              <td colSpan="8">Division 3</td>
            </tr>
          </thead>
          <tbody>
            {division3}
          </tbody>
        </table>
      </div>
      <div className = {"row"}>
        <table className = {"standingsTable"}>
          <thead>
            <tr>
              <td colSpan="8">Division 2</td>
            </tr>
          </thead>
          <tbody>
            {division2}
          </tbody>
        </table>
        <table className = {"standingsTable"}>
          <thead>
            <tr>
              <td colSpan="8">Division 4</td>
            </tr>
          </thead>
          <tbody>
            {division4}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function divisionRows(handler, divisionID, show){

  const teams = handler.get("League", divisionID, "teams");

  const division = [];
  for(let j = 0; j < teams.length; j++){
    const standing = handler.get("Team", teams[j], "standing");
    const colors = {
      background: handler.get("Team", teams[j], "color1"),
      color: handler.get("Team", teams[j], "color2"),
    };
    division.push(
      <tr key={teams[j]} style={colors} onClick={()=>show(teams[j])}>
        <td><b>{handler.get("Team", teams[j], "name")}</b></td>
        <td>{standing[1]}</td>
        <td>{standing[2]}</td>
        <td>{standing[3]}</td>
        <td>{standing[4]}</td>
        <td>:</td>
        <td>{standing[5]}</td>
        <td>{standing[6]}</td>
      </tr>);
  }

  return division;
}
