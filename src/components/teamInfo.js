import React from 'react';
import './teamInfo.css';
import * as Icons from './teamInfoIcons';
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import countryInfo from "./countryFunctions";
import PlayerInfo from './teamHome/playerInfo';
import ProgressBar from 'react-bootstrap/ProgressBar'
import FixturesInfo from './teamHome/fixturesInfo';

export default class TeamInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      panel: "match",
      team: props.team,
      selectedPlayer: null,
      teamInfoFixturesModalShow: false,
      colors: {
        background: props.handler.get("Team",props.team,"color1"),
        color: props.handler.get("Team",props.team,"color2"),
      },
      colorsPlayers: {
        background: props.handler.get("Team",props.team,"color2"),
        color: props.handler.get("Team",props.team,"color1"),
      },
      countryInfo: countryInfo(props.handler.get("Team",props.team,"nationality")),
      division: props.handler.get("Team",props.team,"league division") > 0 ? "Division "+props.handler.get("Team",props.team,"league division") : "No division",
    };
    this.handler = props.handler;
    this.showTeamInfo = props.showTeamInfo;
    this.selectOfTeams = this.handler.get("Team",0,"id").sort((e1,e2)=>this.handler.get("Team",e1,"name").localeCompare(this.handler.get("Team",e2,"name"))).map(e=><option key={e} value={e}>{this.handler.get("Team",e,"name")}</option>)
  }

  handleClose = () => this.setState({teamInfoFixturesModalShow: false,});
  handleShow = () => this.setState({teamInfoFixturesModalShow: true,});
  handleChange = (event) => this.setState({
    team: parseInt(event.target.value),
    colors: {
      background: this.handler.get("Team",parseInt(event.target.value),"color1"),
      color: this.handler.get("Team",parseInt(event.target.value),"color2"),
    },
    colorsPlayers: {
      background: this.handler.get("Team",parseInt(event.target.value),"color2"),
      color: this.handler.get("Team",parseInt(event.target.value),"color1"),
    },
    countryInfo: countryInfo(this.handler.get("Team",parseInt(event.target.value),"nationality")),
    division: this.handler.get("Team",parseInt(event.target.value),"league division") > 0 ? "Division "+this.handler.get("Team",parseInt(event.target.value),"league division") : "No division",
  });

  selectPlayer(player){
    this.setState({
      selectedPlayer: player,
    });
  }

  cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  teamPlayers(){
    const teamPlayers = [];
    const teamPlys = this.handler.get("Team",this.state.team,"players");
    ['G','D','M','F'].forEach(pos => {
      const plys = teamPlys.filter(e=>this.handler.get("Player",e,"position") === pos);
      plys.sort((e1,e2)=>this.handler.get("Player",e1,"name").localeCompare(this.handler.get("Player",e2,"name")));
      const players = [];
      for(let j = 0; j < plys.length; j++){
        const colors = this.state.selectedPlayer === this.handler.get("Player",plys[j],"id") ? this.state.colors : this.state.colorsPlayers;
        const nat = this.handler.get("Player",plys[j],"nationality") === this.handler.get("Team",this.state.team,"nationality") ? ' ' : this.handler.get("Player",plys[j],"nationality");
        const situation = this.handler.get("Player",plys[j],"situation")
        const injsus = situation[0] === 3 ? <FaPlusSquare /> : situation[0] === 4 ? <AiOutlineStop /> : '';
        const contract = this.handler.get("Player",plys[j],"contract")[2];
        players.push(
          <tr key={plys[j]}
              style={colors}
              onClick={()=>this.selectPlayer(plys[j])}>
            <td><b>{this.handler.get("Player",plys[j],"position")}</b></td>
            <td><b>{this.handler.get("Player",plys[j],"name")}</b></td>
            <td><b>{injsus}</b></td>
            <td><b>{this.handler.get("Player",plys[j],"strength")}</b></td>
            <td><b>{nat}</b></td>
            <td><b>{this.cashFormat(contract)}</b></td>
          </tr>);
      }
      const bodyColor = {
        border: '1px solid '+this.state.colors.background
      }
      teamPlayers.push(
        <tbody style={bodyColor}>
          {players}
        </tbody>
      )
    });
    return teamPlayers;
  }

  moralColor = (moral) => {
    if(moral > 60){
      return 'success';
    }
    else if(moral > 30){
      return "warning";
    }
    else{
      return "danger";
    }
  }

  render(){
    return (
      <div
        style={this.state.colors}
        className = {"teamInfo"}>
        <div className = {"teamInfoHeader"}>
          <b>{this.handler.get("Team",this.state.team,"fullName")} ({this.state.countryInfo[0]})</b>
        </div>
        <div className = {"row col-md-12"}>
          <div className = {"col-md-7"}>
            <div className = {"row teamInfoSelection"}>
              <select value={this.state.team} onChange={this.handleChange}>
                {this.selectOfTeams}
              </select>
              <span> {this.state.division} </span>
            </div>
            <div className = {"row"}>
              <table className = {"teamInfoPlayers"}>
                {this.teamPlayers()}
              </table>
            </div>
          </div>
          <div className = {"col-md-5"}>
            <ProgressBar className = {"teamInfoMoralBar"} variant={this.moralColor(this.handler.get("Team",this.state.team,"moral"))} now={this.handler.get("Team",this.state.team,"moral")} />
            <div className = {"teamInfoSupButtons"}>
              <button> {Icons.cash} Finances </button>
              <button onClick={()=>this.handleShow()}> {Icons.calendar} Calendar </button>
            </div>
            <div className = {"teamInfoPlayer"}>
              <PlayerInfo handler={this.handler} player={this.state.selectedPlayer}/>
            </div>
            <div className = {"teamInfoInfButtons"}>
              <div>
                <button> {Icons.search} <span>Search</span> </button>
                <button> {Icons.buy} <span>Buy</span> </button>
                <button> {Icons.bank} <span>Loan</span> </button>
              </div>
              <div>
                <button disabled={this.state.selectedPlayer ? "" : "disabled"}> {Icons.eye} <span>Observed</span> </button>
                <button> {Icons.list} <span>List</span> </button>
                <button onClick={()=>this.showTeamInfo()}> {Icons.check} <span>Close</span> </button>
              </div>
            </div>
          </div>
        </div>
        <FixturesInfo
        handler={this.handler}
        team={this.state.team}
        handleClose={this.handleClose}
        show={this.state.teamInfoFixturesModalShow}/>
      </div>
    );
  }
}
