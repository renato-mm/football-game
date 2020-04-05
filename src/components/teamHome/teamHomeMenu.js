import React from 'react';
import './teamHomeMenu.css';
import Freefoot from './teamHomeMenuFreefoot';
import Formation from './teamHomeMenuFormation';
import Team from './teamHomeMenuTeam';
import Player from './teamHomeMenuPlayer';
import Championship from './teamHomeMenuChampionship';
import Coach from './teamHomeMenuCoach';
import onClickOutside from "react-onclickoutside";
import FixturesInfo from './fixturesInfo';
import Bank from './bank';

class TeamHomeMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showMenu: false,
      menu: '',
      teamFixturesModalShow: false,
      bankModalShow: false,
    };
    this.team = props.team;
    this.formationSelected = props.formationSelected;
    this.showStandings = props.showStandings;
  }

  handleClose = (modal) => this.setState({[modal]: false,});
  handleShow = (modal) => this.setState({[modal]: true,});

  renderFreefoot(){
    if(this.state.showMenu && this.state.menu === "freefoot"){
      return <Freefoot />;
    }
    else{
      return null;
    }
  }

  renderFormation(){
    if(this.state.showMenu && this.state.menu === "formation"){
      return <Formation formationSelected={this.formationSelected}/>;
    }
    else{
      return null;
    }
  }

  renderTeam(){
    if(this.state.showMenu && this.state.menu === "team"){
      return <Team handleShow={(modal)=>this.handleShow(modal)} />;
    }
    else{
      return null;
    }
  }

  renderPlayer(){
    if(this.state.showMenu && this.state.menu === "player"){
      return <Player />;
    }
    else{
      return null;
    }
  }

  renderChampionship(){
    if(this.state.showMenu && this.state.menu === "championship"){
      return <Championship showStandings={this.showStandings} handleShow={()=>this.handleShow('teamFixturesModalShow')}/>;
    }
    else{
      return null;
    }
  }

  renderCoach(){
    if(this.state.showMenu && this.state.menu === "coach"){
      return <Coach />;
    }
    else{
      return null;
    }
  }

  switchMenu(menu, event){
    if(this.state.showMenu){
      if(menu === this.state.menu && event === null){
        this.setState({showMenu: !this.state.showMenu,})
      }
      else{
        this.setState({menu: menu,})
      }
    }
    else if(event === null){
      this.setState({showMenu: !this.state.showMenu, menu: menu,})
    }
  }

  isMenuActive(menu){
    return (this.state.showMenu && this.state.menu === menu) ? ' teamHomeMenuActive' : '';
  }

  handleClickOutside = () => {
    if(this.state.showMenu){
      this.setState({showMenu: !this.state.showMenu, menu: '',})
    }
  };

  render(){
    return (
      <>
      <div className = {"teamHomeMenu"}>
        <div className = {"teamHomeMenuFreefoot"+this.isMenuActive("freefoot")} onClick={() => this.switchMenu("freefoot", null)}>
          <button onMouseOver={(event)=>this.switchMenu("freefoot", event)}>Freefoot</button>
          {this.renderFreefoot()}
        </div>
        <div className = {"teamHomeMenuFormation"+this.isMenuActive("formation")} onClick={() => this.switchMenu("formation", null)}>
          <button onMouseOver={(event)=>this.switchMenu("formation", event)}>Formation</button>
          {this.renderFormation()}
        </div>
        <div className = {"teamHomeMenuTeam"+this.isMenuActive("team")} onClick={() => this.switchMenu("team", null)}>
          <button onMouseOver={(event)=>this.switchMenu("team", event)}>Team</button>
          {this.renderTeam()}
        </div>
        <div className = {"teamHomeMenuPlayer"+this.isMenuActive("player")} onClick={() => this.switchMenu("player", null)}>
          <button onMouseOver={(event)=>this.switchMenu("player", event)}>Player</button>
          {this.renderPlayer()}
        </div>
        <div className = {"teamHomeMenuChampionship"+this.isMenuActive("championship")} onClick={() => this.switchMenu("championship", null)}>
          <button onMouseOver={(event)=>this.switchMenu("championship", event)}>Championship</button>
          {this.renderChampionship()}
        </div>
        <div className = {"teamHomeMenuCoach"+this.isMenuActive("coach")} onClick={() => this.switchMenu("coach", null)}>
          <button onMouseOver={(event)=>this.switchMenu("coach", event)}>Coach</button>
          {this.renderCoach()}
        </div>
      </div>
      <FixturesInfo
      fixtures={this.team.calendar}
      handleClose={()=>this.handleClose('teamFixturesModalShow')}
      show={this.state.teamFixturesModalShow}/>
      <Bank
      handleClose={()=>this.handleClose('bankModalShow')}
      show={this.state.bankModalShow}/>
      </>
    );
  }
}

export default onClickOutside(TeamHomeMenu);
