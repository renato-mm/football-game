import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import './options.css'

export default function Options(props){

  const [key, setKey] = React.useState('general');
  const [general1, setGeneral1] = React.useState(0);
  const [general2, setGeneral2] = React.useState(0);
  const [general3, setGeneral3] = React.useState(0);
  const [general4, setGeneral4] = React.useState(0);
  const [game1, setGame1] = React.useState(0);
  const [game2, setGame2] = React.useState(0);
  const [game3, setGame3] = React.useState(0);

  const show = props.show;
  const handleClose = props.handleClose;

  const handleChange = (event, state) => {
    //
  };

  return (
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Body>
        <Tabs
          transition={false}
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="general" title="General">
            <div className = {"optionsGeneralSelection"}>
              <div>
                <span>Show coaches changes:</span>
                <select value={general1} onChange={(event)=>{setGeneral1(event.target.value);handleChange(event, "general1")}}>
                  <option value='0'>None</option>
                  <option value='1'>Only humans</option>
                  <option value='2'>All</option>
                </select>
              </div>
              <div>
                <span>Show cup draws:</span>
                <select value={general2} onChange={(event)=>{setGeneral2(event.target.value);handleChange(event, "general2")}}>
                  <option value='0'>Never</option>
                  <option value='1'>When humans on it</option>
                  <option value='2'>Always</option>
                </select>
              </div>
              <div>
                <span>Save game:</span>
                <select value={general3} onChange={(event)=>{setGeneral3(event.target.value);handleChange(event, "general3")}}>
                  <option value='0'>Every fixture</option>
                  <option value='1'>Every 3 fixtures</option>
                  <option value='2'>Every season beginning</option>
                </select>
              </div>
              <div>
                <span>Sound:</span>
                <select value={general4} onChange={(event)=>{setGeneral4(event.target.value);handleChange(event, "general4")}}>
                  <option value='0'>On</option>
                  <option value='1'>Off</option>
                </select>
              </div>
            </div>
          </Tab>
          <Tab eventKey="game" title="Game">
            <div className = {"optionsGameSelection"}>
              <div>
                <span>Substitions at halftime:</span>
                <select value={game1} onChange={(event)=>{setGame1(event.target.value);handleChange(event, "game1")}}>
                  <option value='0'>Yes</option>
                  <option value='1'>No</option>
                </select>
              </div>
              <div>
                <span>Show penalties when not involving humans:</span>
                <select value={game2} onChange={(event)=>{setGame2(event.target.value);handleChange(event, "game2")}}>
                  <option value='0'>Yes</option>
                  <option value='1'>No</option>
                </select>
              </div>
              <div>
                <span>Match speed:</span>
                <select value={game3} onChange={(event)=>{setGame3(event.target.value);handleChange(event, "game3")}}>
                  <option value='0'>Very slow</option>
                  <option value='1'>Slow</option>
                  <option value='2'>Normal</option>
                  <option value='3'>Fast</option>
                  <option value='4'>Superfast</option>
                  <option value='5'>Ultrafast</option>
                </select>
              </div>
            </div>
          </Tab>
          <Tab eventKey="control" title="Control">
            <div className = {"optionsControl"}>
              <div>
                <button>Referees</button>
              </div>
              <div>
                <button>Teams in debt</button>
              </div>
              <div>
                <button>Teams with loan</button>
              </div>
              <div>
                <b>Inflation level: 20</b>
              </div>
            </div>
          </Tab>
        </Tabs>
        </Modal.Body>
      </Modal>
  );
  
}
