import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import './coachProfile.css'

export default function Options(props){

  const [key, setKey] = React.useState('general');
  const [general1, setGeneral1] = React.useState(false);
  const [general2, setGeneral2] = React.useState(false);
  const [general3, setGeneral3] = React.useState(false);
  const [game1, setGame1] = React.useState(false);
  const [game2, setGame2] = React.useState(0);

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
          <Tab eventKey="general" title="Salaries management">
            <div className = {"profileGeneralSelection"}>
              <span>The game should automaticly manage the salary of:</span>
              <label>
                <input
                  type="checkbox"
                  checked={general1}
                  onChange={(event)=>setGeneral1(event.target.checked)} />
                  national players
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={general2}
                  onChange={(event)=>setGeneral2(event.target.checked)} />
                  foreign players ensured by the Bosman Law
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={general3}
                  onChange={(event)=>setGeneral3(event.target.checked)} />
                  other foreign players
              </label>
            </div>
          </Tab>
          <Tab eventKey="game" title="Auction options">
            <div className = {"profileGameSelection"}>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={game1}
                    onChange={(event)=>setGame1(event.target.checked)} />
                    I don't want others to be able to see my bids
                </label>
              </div>
              <div onChange={(event)=>setGame2(parseInt(event.target.value))}>
                <span>Bids:</span>
                <label>
                  <input
                    type="radio"
                    value={0}
                    checked={game2 === 0}/>
                    I want to bid every player
                </label>
                <label>
                  <input
                    type="radio"
                    value={1}
                    checked={game2 === 1}/>
                    I don't want to bid weaker players
                </label>
                <label>
                  <input
                    type="radio"
                    value={2}
                    checked={game2 === 2}/>
                    I don't want to bid any players
                </label>
              </div>
            </div>
          </Tab>
        </Tabs>
        </Modal.Body>
      </Modal>
  );
  
}
