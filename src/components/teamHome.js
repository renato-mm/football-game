import React from 'react';
import './teamHome.css';
import TeamHomeMenu from './teamHome/teamHomeMenu';
import TeamHomePanel from './teamHome/teamHomePanel';
import { GoPrimitiveDot } from "react-icons/go";
import { GoDash } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import countryInfo from "./countryFunctions";

export default class TeamHome extends React.Component {
  constructor(props){
    super(props);
    this.state = props.handler.get("Saved State", 0, 'hasTeamHome') ?
    JSON.parse(props.handler.get("Saved State", 0, 'teamHome')) : 
    {
      panel: "match",
      selectedPlayer: null,
      focus: false,
    };
    this.handler = props.handler;
    this.team = props.team;
    this.season = props.season;
    this.nextMatch = props.opponent;
    this.colors = {
      background: this.handler.get("Team",this.team,"color1"),
      color: this.handler.get("Team",this.team,"color2"),
    };
    this.colorsPlayers = {
      background: this.handler.get("Team",this.team,"color2"),
      color: this.handler.get("Team",this.team,"color1"),
    };
    this.coach = "Human"//this.handler.get("Human",this.handler.get("Team",this.team,"coach"),"name");
    this.division = this.handler.get("Team",this.team,"league division");
    this.showStandings = props.showStandings;
    this.showMarket = props.showMarket;
    this.showOpponentInfo = props.showTeamInfo;
    this.ready = props.ready;
    this.countryInfo = countryInfo(this.handler.get("Team",this.team,"nationality"));
    this.handler.set("Saved State", 0, 'hasTeamHome', false);
  }

  componentWillUnmount() {
    this.handler.set("Saved State", 0, 'hasTeamHome', true);
    this.handler.set("Saved State", 0, 'teamHome', JSON.stringify(this.state));
  }

  selectPlayer(player, event){
    if(event.bubbles){
      this.setState({
        panel: "player",
        selectedPlayer: player,
      });
    }
  }

  changePlayerFormation(player, event){
    let situation = this.handler.get("Player",player,"situation");
    if(![3,4].includes(situation[0])){
      event.bubbles = false; 
      situation[0] = situation[0] === 2 ? 0 : situation[0] + 1;
      this.handler.set("Player",player,"situation", situation);
      this.setState({
        panel: "formation",
      });
    }
  }

  teamPlayers(){
    const starter = [' ', <GoPrimitiveDot />, <GoDash />, ' ', ' '];
    const teamPlayers = [];
    const teamPlys = this.handler.get("Team",this.team,"players");
    ['G','D','M','F'].forEach(pos => {
      const plys = teamPlys.filter(e=>this.handler.get("Player",e,"position") === pos);
      plys.sort((e1,e2)=>this.handler.get("Player",e1,"name").localeCompare(this.handler.get("Player",e2,"name")));
      const players = [];
      for(let j = 0; j < plys.length; j++){
        const colors = this.state.selectedPlayer === this.handler.get("Player",plys[j],"id") ? this.colors : this.colorsPlayers;
        const nat = this.handler.get("Player",plys[j],"nationality") === this.handler.get("Team",this.team,"nationality") ? ' ' : this.handler.get("Player",plys[j],"nationality");
        const situation = this.handler.get("Player",plys[j],"situation")
        const start = starter[situation[0]];
        const injsus = situation[0] === 3 ? <FaPlusSquare /> : situation[0] === 4 ? <AiOutlineStop /> : '';
        const contract = this.handler.get("Player",plys[j],"contract");
        players.push(
          <tr key={plys[j]}
              style={colors}
              onClick={(event)=>this.selectPlayer(plys[j],event)}>
            <td onClick={(event)=>this.changePlayerFormation(plys[j],event)}>{start}</td>
            <td><b>{this.handler.get("Player",plys[j],"position")}</b></td>
            <td><b>{this.handler.get("Player",plys[j],"name")}</b></td>
            <td><b>{injsus}</b></td>
            <td><b>{this.handler.get("Player",plys[j],"strength")}</b></td>
            <td><b>{nat}</b></td>
            <td><b>{contract[1]}</b></td>
            <td><b>{contract[0] ? <GoPlus /> : ' '}</b></td>
          </tr>);
      }
      const bodyColor = {
        border: '1px solid '+this.colors.background
      }
      teamPlayers.push(
        <tbody key={pos} style={bodyColor}>
          {players}
        </tbody>
      )
    });
    return teamPlayers;
  }

  changePanel(panel){
    this.setState({
      panel: panel,
    });
  }

  changeFocus(focus){
    this.setState({
      focus: focus,
    });
  }

  renewContract(newSalary){
    const newContract = this.handler.get("Player",this.state.selectedPlayer,"contract");
    newContract[1] = newSalary;
    this.handler.set("Player",this.state.selectedPlayer,"contract", newContract)
    this.setState({
      panel: "player",
    });
  }

  formationSelected(key){
    if(!this.state.focus && ((key >= "0" && key <= "9") || key === 'A' || key === 'a' || key === 'm' || key === 'M')){
      const formations = [[6,3,1],[3,3,4],[3,4,3],[4,2,4],[4,3,3], [4,4,2],[4,5,1],[5,2,3],[5,3,2],[5,4,1]];
      this.handler.set("Team", this.team, "formation", (key >= "0" && key <= "9") ? formations[key] : key);
      this.setState({
        panel: "formation",
      })
    }
    else if(key === 'C' || key === 'c'){
      this.showStandings(key);
    }
    else if(key === 'Enter' && this.state.panel === 'formation'){
      this.ready();
    }
  }

  renderMenu(){
    return(
      <TeamHomeMenu
      handler={this.handler}
      team={this.team}
      formationSelected={(key) => this.formationSelected(key)}
      showStandings={this.showStandings}
      showMarket={this.showMarket}/>
    );
  }

  renderPanel(){
    return(
      <TeamHomePanel
      handler={this.handler}
      season={this.season}
      team={this.team}
      nextMatch={this.nextMatch}
      colors={this.colors}
      player={this.state.selectedPlayer}
      panel={this.state.panel}
      changePanel={panel=>this.changePanel(panel)}
      renewContract={(newSalary)=>this.renewContract(newSalary)}
      changeFocus={focus=>this.changeFocus(focus)}
      showOpponentInfo={this.showOpponentInfo}
      ready={this.ready}/>
    );
  }

  render(){
    return <div
      style={this.colors}
      className = {"teamHome"}
      onKeyPress = {(event) => this.formationSelected(event.key)}
      tabIndex="0">
      <div className = {"teamHomeHeader"}>
        <b>{this.handler.get("Team",this.team,"fullName")}</b>
      </div>
      {this.renderMenu()}
      <div className = {"row col-md-12"}>
        <div className = {"col-md-6"}>
          <div className = {"row teamHomeCoach"}> <b>{this.coach}</b> </div>
          <div className = {"row teamHomeInfo"}>
            {this.countryInfo[1]}
            <div>
              {this.countryInfo[0]} 
              <span>Division {this.division}</span>
            </div>
          </div>
          <div className = {"row"}>
            <table className = {"teamHomePlayers"}>
              {this.teamPlayers()}
            </table>
          </div>
        </div>
        <div className = {"col-md-6"}>
          {this.renderPanel()}
        </div>
      </div>
    </div>;
  }
}
