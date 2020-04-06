import React from 'react';
import Modal from 'react-bootstrap/Modal'
import './stadium.css'
import { IconContext } from "react-icons";
import { IoMdConstruct } from "react-icons/io";
import { AiOutlineBank } from "react-icons/ai";

export default function Stadium(props){

  const show = props.show;
  const handleClose = props.handleClose;

  const bank = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <AiOutlineBank />
  </IconContext.Provider>;
  const build = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
  <IoMdConstruct />
  </IconContext.Provider>;

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
          <div className = {"stadiumDrawing"}>Drawing</div>
          <div className = {"stadiumCapacity"}><b>10000 seats</b></div>
          <div className = {"stadiumInfo"}>
            <p>
              Price of stand with<br/>
              5000 seats: {cashFormat(350000)}.
            </p>
            <div className = {"stadiumButtons"}>
              <button> {bank} <span>Loan</span> </button>
              <button> {build} <span>Build</span> </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  );
  
}
