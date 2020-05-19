import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './bank.css'
import { IconContext } from "react-icons";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

export default function Bank(props){

  const show = props.show;
  const handleClose = props.handleClose;
  const plus = <IconContext.Provider value={{className: "bankIcon"}}>
    <FaPlus />
  </IconContext.Provider>;
  const minus = <IconContext.Provider value={{className: "bankIcon"}}>
    <FaMinus />
  </IconContext.Provider>;

  const finances = props.handler.get("Team",props.team,"finances");

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
          <div className = {"bankMoney"}><b>Debt</b><span>{cashFormat(finances[4])}</span></div>
          <div className = {"bankMoney"}><b>Interest</b><span>{cashFormat(finances[3])}</span></div>
          <div className = {"bankButtons"}>
            <button onClick={props.loan}>{plus} <span>500 thousand euros</span></button>
            <button onClick={props.pay}>{minus} <span>500 thousand euros</span></button>
          </div>
          <div className = {"bankMoney"}><b>Current cash</b><span>{cashFormat(finances[0])}</span></div>
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
