import React from 'react';
import './teamHome.css';
import TeamHomeMenu from './teamHome/teamHomeMenu';
import TeamHomePanel from './teamHome/teamHomePanel';
import * as teamHomeFunc from './teamHomeFunctions';
import { GoPrimitiveDot } from "react-icons/go";
import { GoDash } from "react-icons/go";
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import ReactCountryFlag from "react-country-flag";

export default class TeamHome extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      team: props.team,
      opponnent: props.opponnent,
      teamStandings: props.teamStandings,
      opponnentStandings: props.opponnentStandings,
      colors: {
        background: props.team.color1,
        color: props.team.color2,
      },
      colorsPlayers: {
        background: props.team.color2,
        color: props.team.color1,
      },
      panel: "match",
      selectedPlayer: null,
    };
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
    ['G','D','M','A'].forEach(pos => {
      const plys = teamPlys.filter(e=>e.position === pos);
      plys.sort((e1,e2)=>e1.name>e2.name);
      const players = [];
      for(let j = 0; j < plys.length; j++){
        const colors = this.state.selectedPlayer === plys[j] ? this.state.colors : this.state.colorsPlayers;
        const nat = plys[j].nationality === this.state.team.nationality ? ' ' : plys[j].nationality;
        const start = plys[j].injured ? <FaPlusSquare /> : plys[j].suspended ? <AiOutlineStop /> : starter[plys[j].starting];
        players.push(
          <tr style={colors}
              onClick={(event)=>this.selectPlayer(plys[j],event)}>
            <td onClick={(event)=>this.changePlayerFormation(plys[j],event)}>{start}</td>
            <td>&nbsp;<b>{plys[j].position}</b></td>
            <td>&nbsp;<b>{plys[j].name}</b>&nbsp;</td>
            <td>&nbsp;<b>{plys[j].power}</b>&nbsp;</td>
            <td>&nbsp;<b>{nat}</b>&nbsp;</td>
            <td>&nbsp;<b>{plys[j].salary}</b>&nbsp;</td>
            <td><b>{plys[j].salaryRenewed ? '+' : ' '}</b></td>
          </tr>);
      }
      teamPlayers.push(
        <tbody>
          {players}
        </tbody>
      )
    });
    return teamPlayers;
  }

  renderMenu(){
    return(
      <TeamHomeMenu
      formationSelected={(key) => this.formationSelected(key)}/>
    );
  }

  changePanel(panel){
    this.setState({
      panel: panel,
    });
  }

  renderPanel(){
    return(
      <TeamHomePanel
      team={this.state.team}
      opponnent={this.state.opponnent}
      teamStandings={this.state.teamStandings}
      opponnentStandings={this.state.opponnentStandings}
      colors={this.state.colors}
      player={this.state.selectedPlayer}
      panel={this.state.panel}
      changePanel={panel=>this.changePanel(panel)}/>
    );
  }

  formationSelected(key){
    console.log(key)
    if((key >= "0" && key <= "9") || key === 'A' || key === 'a' || key === 'm' || key === 'M'){
      const newTeamPlayers = teamHomeFunc.selectFormation(this.state.team.players, key);
      const newTeam = this.state.team;
      newTeam.players = newTeamPlayers;
      this.setState({
        team: newTeam,
        panel: "formation",
      })
    }
    else if(key === 'C' || key === 'c'){
      // Show standings
    }
    else if(key === 'Enter' && this.state.panel === 'formation'){
      // Begin matches
    }
  }

  render(){
    const CountryCodes = require('country-code-info');
    const country = CountryCodes.findCountry({'fifa': this.state.team.nationality});
    const countryName = country.name;
    return (
      <div
        style={this.state.colors}
        className = {"teamHome"}
        onKeyPress = {(event) => this.formationSelected(event.key)}
        tabIndex="0">
        <div className = {"teamHomeHeader"}>
          <b>{this.state.team.fullName}</b>
        </div>
        {this.renderMenu()}
        <div className = {"row col-md-12"}>
          <div className = {"col-md-6"}>
            <div className = {"row"}> {this.state.team.coach} </div>
            <div className = {"row"}>
              <div>
                <ReactCountryFlag countryCode={country.a2} svg style={{width: '3em', height: '3em',}}/>
                &nbsp;{countryName}&nbsp;&nbsp; Division {this.state.team.division}</div>
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
      </div>
    );
  }
}
