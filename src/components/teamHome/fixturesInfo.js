import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './fixturesInfo.css'

export default function FixturesInfo(props){

  const homeColors = {
    background: 'blue',
    color: 'white',
  };
  const awayColors = {
    background: 'white',
    color: 'blue',
  };
  const homeCupColors = {
    background: 'red',
    color: 'white',
  };
  const awayCupColors = {
    background: 'white',
    color: 'red',
  };
  const colors = [[homeColors,awayColors],[homeCupColors,awayCupColors]];

  const calendar = [];
  const fixtures = props.handler.get("Team",props.team,"calendar");
  for(let j = 0; j < fixtures.length; j++){
    const cup = fixtures[j][5] === 'League' ? 0 : 1;
    const home = fixtures[j][0] === props.team ? 0 : 1;
    const rowColors = colors[cup][home];
    calendar.push(
      <tr key={j} style={rowColors}>
        <td>{fixtures[j][5]+" #"+fixtures[j][7]}</td>
        <td><b>{!home ? "H" : "A"}</b></td>
        <td><b>{props.handler.get("Team",fixtures[j][0],"name")}</b></td>
        <td><b>{!fixtures[j][9] ? "" : fixtures[j][2]}</b></td>
        <td><b>{!fixtures[j][9] ? "" : ":"}</b></td>
        <td><b>{!fixtures[j][9] ? "" : fixtures[j][3]}</b></td>
        <td><b>{props.handler.get("Team",fixtures[j][1],"name")}</b></td>
        <td><b>{!fixtures[j][9] ? '' : fixtures[j][4] === 0 ? 'D' : fixtures[j][4] === props.team ? 'W' : 'L'}</b></td>
      </tr>);
  }

  return (
      <Modal show={props.show} onHide={props.handleClose} animation={false} centered>
        <Modal.Body>
          <table className = {"fixturesInfo"}>
            {calendar}
          </table>
        </Modal.Body>
      </Modal>
  );
  
}
