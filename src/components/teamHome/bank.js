import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './bank.css'

export default function Bank(props){

  const show = props.show;
  const handleClose = props.handleClose;

  const cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: "name",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Body>
          <div className = {"bankMoney"}><b>Debt</b><span>{cashFormat(0)}</span></div>
          <div className = {"bankMoney"}><b>Interest</b><span>{cashFormat(0)}</span></div>
          <div className = {"bankButtons"}>
            <button>loan <span>500 thousand euros</span></button>
            <button>pay <span>500 thousand euros</span></button>
          </div>
          <div className = {"bankMoney"}><b>Current cash</b><span>{cashFormat(0)}</span></div>
          <hr/>
          <p>
            Interest is calculated by adding to it 5% of the debt after every match.
            The debt can be reduced anytime, and it can be raised only if allowed.
            The maximum ammount you can loan depends on the trust the bank have in you at the moment.
          </p>
        </Modal.Body>
      </Modal>
  );
  
}
