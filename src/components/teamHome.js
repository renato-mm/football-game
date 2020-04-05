import React from 'react';
import './teamHome.css';
import TeamHomeMenu from './teamHome/teamHomeMenu';
import TeamHomePanel from './teamHome/teamHomePanel';
import TeamInfo from './teamInfo';
import * as teamHomeFunc from './teamHomeFunctions';
import { GoPrimitiveDot } from "react-icons/go";
import { GoDash } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import countryInfo from "./countryFunctions";

export default class TeamHome extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      team: props.team,
      panel: "match",
      selectedPlayer: null,
      focus: false,
      teamInfo: props.opponnent,
      showOpponnentInfo: false,
    };
    this.season = props.season;
    this.opponnent = props.opponnent;
    this.teamStandings = props.teamStandings;
    this.opponnentStandings = props.opponnentStandings;
    this.colors = {
      background: props.team.color1,
      color: props.team.color2,
    };
    this.colorsPlayers = {
      background: props.team.color2,
      color: props.team.color1,
    };
    this.showStandings = props.showStandings;
    this.countryInfo = countryInfo(props.team.nationality);
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
    if(player.injured === 0 && player.suspended === 0){
      event.bubbles = false; 
      const team = this.state.team;
      const idx = team.players.indexOf(player);
      team.players[idx].starting = team.players[idx].starting === 2 ? 0 : team.players[idx].starting + 1;
      this.setState({
        panel: "formation",
        team: team,
      });
    }
  }

  teamPlayers(){
    const starter = [null, <GoPrimitiveDot />, <GoDash />];
    const teamPlayers = [];
    const teamPlys = this.state.team.players;
    ['G','D','M','F'].forEach(pos => {
      const plys = teamPlys.filter(e=>e.position === pos);
      plys.sort((e1,e2)=>e1.name>e2.name);
      const players = [];
      for(let j = 0; j < plys.length; j++){
        const colors = this.state.selectedPlayer === plys[j] ? this.colors : this.colorsPlayers;
        const nat = plys[j].nationality === this.state.team.nationality ? ' ' : plys[j].nationality;
        const start = starter[plys[j].starting];
        const injsus = plys[j].injured ? <FaPlusSquare /> : plys[j].suspended ? <AiOutlineStop /> : '';
        players.push(
          <tr style={colors}
              onClick={(event)=>this.selectPlayer(plys[j],event)}>
            <td onClick={(event)=>this.changePlayerFormation(plys[j],event)}>{start}</td>
            <td>&nbsp;<b>{plys[j].position}</b></td>
            <td>&nbsp;<b>{plys[j].name}</b>&nbsp;</td>
            <td>&nbsp;<b>{plys[j].power}</b>&nbsp;</td>
            <td>&nbsp;<b>{injsus}</b>&nbsp;</td>
            <td>&nbsp;<b>{nat}</b>&nbsp;</td>
            <td>&nbsp;<b>{plys[j].salary}</b>&nbsp;</td>
            <td><b>{plys[j].salaryRenewed ? <GoPlus /> : ' '}</b></td>
          </tr>);
      }
      const bodyColor = {
        border: '1px solid '+this.state.team.color1
      }
      teamPlayers.push(
        <tbody style={bodyColor}>
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

  showOpponnentInfo(){
    this.setState({
      showOpponnentInfo: !this.state.showOpponnentInfo,
    });
  }

  renewContract(newSalary){
    const newPlayer = this.state.selectedPlayer;
    newPlayer.salary = newSalary;
    newPlayer.salaryRenewed = true;
    this.setState({
      panel: "player",
      selectedPlayer: newPlayer
    });
  }

  formationSelected(key){
    if(!this.state.focus && ((key >= "0" && key <= "9") || key === 'A' || key === 'a' || key === 'm' || key === 'M')){
      const newTeamPlayers = teamHomeFunc.selectFormation(this.state.team.players, key);
      const newTeam = this.state.team;
      newTeam.players = newTeamPlayers;
      this.setState({
        team: newTeam,
        panel: "formation",
      })
    }
    else if(key === 'C' || key === 'c'){
      this.showStandings(key);
    }
    else if(key === 'Enter' && this.state.panel === 'formation'){
      // Begin matches
    }
  }

  renderMenu(){
    return(
      <TeamHomeMenu
      team={this.state.team}
      formationSelected={(key) => this.formationSelected(key)}
      showStandings={this.showStandings}/>
    );
  }

  renderPanel(){
    return(
      <TeamHomePanel
      season={this.season}
      team={this.state.team}
      opponnent={this.opponnent}
      teamStandings={this.teamStandings}
      opponnentStandings={this.opponnentStandings}
      colors={this.colors}
      player={this.state.selectedPlayer}
      panel={this.state.panel}
      changePanel={panel=>this.changePanel(panel)}
      renewContract={(newSalary)=>this.renewContract(newSalary)}
      changeFocus={focus=>this.changeFocus(focus)}
      showOpponnentInfo={()=>this.showOpponnentInfo()}/>
    );
  }

  renderOpponnentInfo() {
    return <TeamInfo
            team = {this.state.teamInfo}
            showTeamInfo={()=>this.showOpponnentInfo()}/>
  }

  renderTeamHome(){
    return <div
      style={this.colors}
      className = {"teamHome"}
      onKeyPress = {(event) => this.formationSelected(event.key)}
      tabIndex="0">
      <div className = {"teamHomeHeader"}>
        <b>{this.state.team.fullName}</b>
      </div>
      {this.renderMenu()}
      <div className = {"row col-md-12"}>
        <div className = {"col-md-6"}>
          <div className = {"row teamHomeCoach"}> <b>{this.state.team.coach}</b> </div>
          <div className = {"row teamHomeInfo"}>
            {this.countryInfo[1]}
            <div>
              {this.countryInfo[0]} 
              <span>Division {this.state.team.division}</span>
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

  render(){
    
    return (
      <div>
        {this.state.showOpponnentInfo ? this.renderOpponnentInfo() : this.renderTeamHome()}
      </div>
    );
  }
}
