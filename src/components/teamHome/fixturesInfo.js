import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './fixturesInfo.css'

export default function FixturesInfo(props){

  const show = props.show;
  const handleClose = props.handleClose;
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
  const fixtures = props.fixtures[0].matches.sort((e1,e2)=>e1.fixture>e2.fixture);
  for(let j = 0; j < fixtures.length; j++){
    const cup = fixtures[j].fixture % 1 === 0 ? 0 : 1;
    const home = fixtures[j].location === "home" ? 0 : 1;
    const rowColors = colors[cup][home];
    calendar.push(
      <tr key={fixtures[j].fixture} style={rowColors}>
        <td>{cup ? "Cup" : fixtures[j].fixture}</td>
        <td>&nbsp;<b>{!home ? "H" : "A"}</b></td>
        <td>&nbsp;<b>{fixtures[j].opponnent}</b></td>
        <td>&nbsp;<b>{fixtures[j].teamScore < 0 ? "" : fixtures[j].teamScore+" : "+fixtures[j].oppScore}</b>&nbsp;</td>
        <td>&nbsp;<b>{fixtures[j].result}</b></td>
        <td>&nbsp;<b>{" "}</b></td>
      </tr>);
  }

  return (
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Body>
          <table className = {"fixturesInfo"}>
            {calendar}
          </table>
        </Modal.Body>
      </Modal>
  );
  
}
