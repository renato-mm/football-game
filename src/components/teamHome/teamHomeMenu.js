import React from 'react';
import './teamHomeMenu.css';
import onClickOutside from "react-onclickoutside";
import FixturesInfo from './fixturesInfo';
import Bank from './bank';
import Stadium from './stadium';

class TeamHomeMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showMenu: false,
      menu: '',
      teamFixturesModalShow: false,
      bankModalShow: false,
      stadiumModalShow: false,
    };
    this.handler = props.handler;
    this.team = props.team;
    this.formationSelected = props.formationSelected;
    this.showStandings = props.showStandings;
    this.showMarket = props.showMarket;
  }

  handleClose = (modal) => this.setState({[modal]: false,});
  handleShow = (modal) => this.setState({[modal]: true,});

  renderFreefoot(){
    if(this.state.showMenu && this.state.menu === "freefoot"){
      return <TeamHomeMenuFreefoot />;
    }
    else{
      return null;
    }
  }

  renderFormation(){
    if(this.state.showMenu && this.state.menu === "formation"){
      return <TeamHomeMenuFormation
              handler={this.handler}
              players={this.handler.get("Team",this.team,"players")}
              formationSelected={this.formationSelected}/>;
    }
    else{
      return null;
    }
  }

  renderTeam(){
    if(this.state.showMenu && this.state.menu === "team"){
      return <TeamHomeMenuTeam handleShow={(modal)=>this.handleShow(modal)} />;
    }
    else{
      return null;
    }
  }

  renderPlayer(){
    if(this.state.showMenu && this.state.menu === "player"){
      return <TeamHomeMenuPlayer team={this.team} showMarket={this.showMarket}/>;
    }
    else{
      return null;
    }
  }

  renderChampionship(){
    if(this.state.showMenu && this.state.menu === "championship"){
      return <TeamHomeMenuChampionship showStandings={this.showStandings} handleShow={()=>this.handleShow('teamFixturesModalShow')}/>;
    }
    else{
      return null;
    }
  }

  renderCoach(){
    if(this.state.showMenu && this.state.menu === "coach"){
      return <TeamHomeMenuCoach />;
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
      handler={this.handler}
      team={this.team}
      handleClose={()=>this.handleClose('teamFixturesModalShow')}
      show={this.state.teamFixturesModalShow}/>
      <Bank
      handleClose={()=>this.handleClose('bankModalShow')}
      show={this.state.bankModalShow}/>
      <Stadium
      handleClose={()=>this.handleClose('stadiumModalShow')}
      show={this.state.stadiumModalShow}/>
      </>
    );
  }
}

export default onClickOutside(TeamHomeMenu);

function TeamHomeMenuChampionship(props){
  return (
    <>
      <table className = {"teamHomeMenuTable"}>
        <tbody>
          <tr onClick={()=>props.showStandings('C')}>
            <td>Standings</td>
            <td>C</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">Top Scorers</td>
          </tr>
          <tr onClick={props.handleShow}>
            <td colSpan="2">Fixtures</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">Last champions</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">All Time Top Scorers</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function TeamHomeMenuCoach(){
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        <tr>
          <td>History</td>
        </tr>
        <tr>
          <td>Coaches Management</td>
        </tr>
        <tr>
          <td>Ranking</td>
        </tr>
        <tr>
          <td>Profile</td>
        </tr>
      </tbody>
    </table>
  );
}

function TeamHomeMenuFormation(props) {

  const gks = props.players.filter(e=>props.handler.get("Player",e,"position")==="G").length;
  const def = props.players.filter(e=>props.handler.get("Player",e,"position")==="D").length;
  const mid = props.players.filter(e=>props.handler.get("Player",e,"position")==="M").length;
  const fwd = props.players.filter(e=>props.handler.get("Player",e,"position")==="F").length;
  const formations = [];
  [["1","3-3-4"],["2","3-4-3"],["3","4-2-4"],["4","4-3-3"],
  ["5","4-4-2"],["6","4-5-1"],["7","5-2-3"],["8","5-3-2"],
  ["9","5-4-1"],["0","6-3-1"],["A","Automático"],["M","Melhores"]].forEach(e => {
    const color = {color: "gray"};
    const disable = e[0] !== 'A' && e[0] !== 'M' && (gks < 1 ||
                    def < parseInt(e[1].slice(0,1)) ||
                    mid < parseInt(e[1].slice(2,3)) ||
                    fwd < parseInt(e[1].slice(4)));
    formations.push(
      <tr key={e[0]} style={disable ? color : {}} onClick={()=>props.formationSelected(e[0])}>
        <td>{e[1]}</td>
        <td>{e[0]}</td>
      </tr>);
  })

  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        {formations}
      </tbody>
    </table>
  );
}

function TeamHomeMenuFreefoot(){
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        <tr>
          <td>Options</td>
        </tr>
        <tr>
          <td>Save</td>
        </tr>
        <tr>
          <td>Load</td>
        </tr>
        <tr>
          <td>About</td>
        </tr>
      </tbody>
    </table>
  );
}

function TeamHomeMenuPlayer(props){
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        <tr>
          <td>Sell</td>
        </tr>
        <tr>
          <td>Players under observation</td>
        </tr>
        <tr>
          <td onClick={()=>props.showMarket(props.team)}>Search</td>
        </tr>
        <tr>
          <td>Last transfers</td>
        </tr>
        <tr>
          <td>Acquisitions</td>
        </tr>
      </tbody>
    </table>
  );
}

function TeamHomeMenuTeam(props){
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        <tr onClick={()=>props.handleShow('bankModalShow')}>
          <td>Ask Loan / Pay Debt</td>
        </tr>
        <tr onClick={()=>props.handleShow('stadiumModalShow')}>
          <td>Stadium</td>
        </tr>
        <tr onClick={()=>props.handleShow('teamHistoryModalShow')}>
          <td>History</td>
        </tr>
      </tbody>
    </table>
  );
}
