import React from 'react';
import './teamHomePanelNewSalary.css'
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

export default class TeamHomePanelNewSalary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      salary: props.salary[1],
    };
    this.changePanel = props.changePanel;
    this.renewContract = props.renewContract;
    this.changeFocus = props.changeFocus;
    this.check = <IconContext.Provider value={{className: "teamHomePanelNewSalaryGreenCheck"}}>
      <FaCheck />
    </IconContext.Provider>;
    this.times = <IconContext.Provider value={{className: "teamHomePanelNewSalaryRedTimes"}}>
      <FaTimes />
    </IconContext.Provider>;
  }
  
  componentDidMount() {
    const inputs = document.getElementsByTagName('input');
    for (let input of inputs) {
        input.addEventListener('focus', () => this.changeFocus(true));
        input.addEventListener('blur', () => this.changeFocus(false));
    }
  }

  updateSalary(event){
    this.setState({salary: event.target.value})
  }

  render(){
    return (
      <div className = {"row teamHomePanelNewSalary"}>
        <div className = {"title"}>
          Renew contract
        </div>
        <div className = {"selection"}>
          New salary
          <input type='number' value={this.state.salary}
          onChange={(event)=>this.updateSalary(event)}
          min="0" step="250"/>
        </div>
        <div className = {"buttons"}>
          <button onClick={()=>this.renewContract(this.state.salary)}> {this.check} Offer </button>
          <button onClick={()=>this.changePanel("player")}> {this.times} Cancel </button>
        </div>
      </div>
    );
  }
}
