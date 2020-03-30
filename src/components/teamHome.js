import React from 'react';
import './teamHome.css';
import TeamHomeMenu from './teamHome/teamHomeMenu';
import TeamHomePanel from './teamHome/teamHomePanel';
import { GoPrimitiveDot } from "react-icons/go";
import { GoDash } from "react-icons/go";
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";

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

  selectPlayer(player){
    this.setState({
      panel: "player",
      selectedPlayer: player,
    });
  }

  teamPlayers(){
    const starter = [null, <GoPrimitiveDot />, <GoDash />];
    const teamPlayers = [];
    for(let j = 0; j < this.state.team.players.length; j++){
      const colors = this.state.selectedPlayer === this.state.team.players[j] ? this.state.colors : this.state.colorsPlayers;
      const nat = this.state.team.players[j].nationality === this.state.team.nationality ? ' ' : this.state.team.players[j].nationality;
      const start = this.state.team.players[j].injured ? <FaPlusSquare /> : this.state.team.players[j].suspended ? <AiOutlineStop /> : starter[this.state.team.players[j].starting];
      teamPlayers.push(
        <tr style={colors}
            onClick={()=>this.selectPlayer(this.state.team.players[j])}>
          <td>{start}</td>
          <td>&nbsp;<b>{this.state.team.players[j].position}</b></td>
          <td>&nbsp;<b>{this.state.team.players[j].name}</b>&nbsp;</td>
          <td>&nbsp;<b>{this.state.team.players[j].power}</b>&nbsp;</td>
          <td>&nbsp;<b>{nat}</b>&nbsp;</td>
          <td>&nbsp;<b>{this.state.team.players[j].salary}</b>&nbsp;</td>
          <td><b>{this.state.team.players[j].salaryRenewed ? '+' : ' '}</b></td>
        </tr>);
    }
    return teamPlayers;
  }

  renderMenu(){
    return(
      <TeamHomeMenu />
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

  render(){
    return (
      <div style={this.state.colors} className = {"teamHome"} >
        <div className = {"teamHomeHeader"}>
          <b>{this.state.team.fullName}</b>
        </div>
        {this.renderMenu()}
        <div className = {"row col-md-12"}>
          <div className = {"col-md-6"}>
            <div className = {"row"}> Coach name </div>
            <div className = {"row"}>
              <div>Team's Country Flag &nbsp;&nbsp;&nbsp; Division {this.state.team.division}</div>
            </div>
            <div className = {"row"}>
              <table className = {"teamHomePlayers"}>
                <tbody>
                  {this.teamPlayers()}
                </tbody>
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
