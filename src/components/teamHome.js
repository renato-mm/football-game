import React from 'react';
import './teamHome.css';
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
      oppColors: {
        background: props.opponnent.color1,
        color: props.opponnent.color2,
      },
      panel: "match",
    };
  }

  teamPlayers(){
    const starter = [null, <GoPrimitiveDot />, <GoDash />];
    const teamPlayers = [];
    for(let j = 0; j < this.state.team.players.length; j++){
      const nat = this.state.team.players[j].nationality === this.state.team.nationality ? ' ' : this.state.team.players[j].nationality;
      const start = this.state.team.players[j].injured ? <FaPlusSquare /> : this.state.team.players[j].suspended ? <AiOutlineStop /> : starter[this.state.team.players[j].starting];
      teamPlayers.push(
        <tr>
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

  headToHead(){
    const headToHead = [];
    headToHead.push(
    <tr style={this.state.colors}>
      <td>{this.state.team.name}</td>
      <td>&nbsp;{this.state.teamStandings.wins}&nbsp;</td>
      <td>&nbsp;{this.state.teamStandings.draws}&nbsp;</td>
      <td>&nbsp;{this.state.teamStandings.losses}&nbsp;</td>
      <td>&nbsp;{this.state.teamStandings.goalsFor}&nbsp;:&nbsp;{this.state.teamStandings.goalsAgainst}&nbsp;</td>
      <td>{this.state.teamStandings.points}</td>
    </tr>);
    headToHead.push(
    <tr style={this.state.oppColors}>
      <td>{this.state.opponnent.name}</td>
      <td>&nbsp;{this.state.opponnentStandings.wins}&nbsp;</td>
      <td>&nbsp;{this.state.opponnentStandings.draws}&nbsp;</td>
      <td>&nbsp;{this.state.opponnentStandings.losses}&nbsp;</td>
      <td>&nbsp;{this.state.opponnentStandings.goalsFor}&nbsp;:&nbsp;{this.state.opponnentStandings.goalsAgainst}&nbsp;</td>
      <td>{this.state.opponnentStandings.points}</td>
    </tr>);
    return headToHead;
  }

  selectedButton(button){
    return (this.state.panel === button) ? 'teamHomePanelMenuActive' : '';
  }

  render(){
    return (
      <div style={this.state.colors} className = {"teamHome"} >
        <div className = {"teamHomeHeader"}>
          <b>{this.state.team.fullName}</b>
        </div>
        <div className = {"teamHomeMenu"}>
          <button>Freefoot</button>
          <button>Formation</button>
          <button>Team</button>
          <button>Player</button>
          <button>Championship</button>
          <button>Coach</button>
        </div>
        <div className = {"row col-md-12"}>
          <div className = {"col-md-6"}>
            <div className = {"row"}> Coach name </div>
            <div className = {"row"}>
              <div>Team's Country Flag &nbsp;&nbsp;&nbsp; Division {this.state.team.division}</div>
            </div>
            <div className = {"row"}>
              <table style={this.state.colorsPlayers} className = {"teamHomePlayers"}>
                <tbody>
                  {this.teamPlayers()}
                </tbody>
              </table>
            </div>
          </div>
          <div className = {"col-md-6"}>
            <div className = {"row nextMatch"}> Next Match <span>Current Year</span></div>
            <div style={this.state.oppColors} className = {"row nextMatchInfo"}> {this.state.opponnent.name} <div>HOME - Fixture #4</div></div>
            <div className = {"row"}>
              <table className = {"teamHomeHeadToHead"}>
                <tbody>
                  {this.headToHead()}
                </tbody>
              </table>
            </div>
            <div className = {"row"}>
              <div className = {"teamHomeLastHeadtoHead"}>
                Last head to head <span> <b>W/D/L 0:0 (year)</b> </span></div>
              </div>
            <div className = {"row teamHomeCash"}>
              <div> Cash </div>
              <div> {this.state.team.cash} </div>
            </div>
            <div className = {"row teamHomeMoral"}>
              <div> Moral </div>
              <div> {this.state.team.moral} </div>
            </div>
            <div className = {"row teamHomePanelMenu"}>
              <button onClick={()=>this.setState({panel:"match"})} className={this.selectedButton("match")}>Match</button>
              <button onClick={()=>this.setState({panel:"player"})} className={this.selectedButton("player")}>Player</button>
              <button onClick={()=>this.setState({panel:"finances"})} className={this.selectedButton("finances")}>Finance</button>
              <button onClick={()=>this.setState({panel:"formation"})} className={this.selectedButton("formation")}>Formation</button>
              <button onClick={()=>this.setState({panel:"opponnent"})} className={this.selectedButton("opponnent")}>Opponnent</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
