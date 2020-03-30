import React from 'react';
import './teamHomeMenu.css';
import Freefoot from './teamHomeMenuFreefoot';
import Formation from './teamHomeMenuFormation';
import Team from './teamHomeMenuTeam';
import Player from './teamHomeMenuPlayer';
import Championship from './teamHomeMenuChampionship';
import Coach from './teamHomeMenuCoach';

export default class TeamHomeMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showModal: false,
      modal: '',
    };
  }

  selectedButton(button){
    return (this.state.panel === button) ? 'teamHomePanelMenuActive' : '';
  }

  renderFreefoot(){
    if(this.state.showModal && this.state.modal === "freefoot"){
      return <Freefoot />;
    }
    else{
      return null;
    }
  }

  renderFormation(){
    if(this.state.showModal && this.state.modal === "formation"){
      return <Formation />;
    }
    else{
      return null;
    }
  }

  renderTeam(){
    if(this.state.showModal && this.state.modal === "team"){
      return <Team />;
    }
    else{
      return null;
    }
  }

  renderPlayer(){
    if(this.state.showModal && this.state.modal === "player"){
      return <Player />;
    }
    else{
      return null;
    }
  }

  renderChampionship(){
    if(this.state.showModal && this.state.modal === "championship"){
      return <Championship />;
    }
    else{
      return null;
    }
  }

  renderCoach(){
    if(this.state.showModal && this.state.modal === "coach"){
      return <Coach />;
    }
    else{
      return null;
    }
  }

  switchModal(menu){
    if(this.state.showModal){
      if(menu === this.state.modal){
        this.setState({showModal: !this.state.showModal,})
      }
      else{
        this.setState({modal: menu,})
      }
    }
    else{
      this.setState({showModal: !this.state.showModal, modal: menu,})
    }
  }

  render(){
    return (
      <div className = {"teamHomeMenu"}>
        <div className = {"teamHomeMenuFreefoot"} onClick={() => this.switchModal("freefoot")}>
          <button>Freefoot</button>
          {this.renderFreefoot()}
        </div>
        <div className = {"teamHomeMenuFormation"} onClick={() => this.switchModal("formation")}>
          <button>Formation</button>
          {this.renderFormation()}
        </div>
        <div className = {"teamHomeMenuTeam"} onClick={() => this.switchModal("team")}>
          <button>Team</button>
          {this.renderTeam()}
        </div>
        <div className = {"teamHomeMenuPlayer"} onClick={() => this.switchModal("player")}>
          <button>Player</button>
          {this.renderPlayer()}
        </div>
        <div className = {"teamHomeMenuChampionship"} onClick={() => this.switchModal("championship")}>
          <button>Championship</button>
          {this.renderChampionship()}
        </div>
        <div className = {"teamHomeMenuCoach"} onClick={() => this.switchModal("coach")}>
          <button>Coach</button>
          {this.renderCoach()}
        </div>
      </div>
    );
  }
}
