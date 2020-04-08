import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import GameInitializer from './components/gameInitializer';
import {base_info} from './clubs/clubs';
import {InfoHandler} from './components/infoHandler';
import Division from './components/division';
import Standings from './components/standings';
import TeamHome from './components/teamHome';
import TeamInfo from './components/teamInfo';
import * as Teams from './components/teams';


const currDivs = [
  {teamID: 'cruzeiro1921', color1: "blue", color2: "white", team: 'Cruzeiro', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'atletico1906', color1: "black", color2: "white", team: 'Atlético-MG', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'flamengo1895', color1: "red", color2: "black", team: 'Flamengo', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'liverpool1892', color1: "red", color2: "white", team: 'Liverpool', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0}
]

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      screen: "Start", // a string that represents the current game screen
      season: 2020,
      currentDivisions: [currDivs], // an array of lists, each one representing a single division containing its rank and a list of objects with current standings info of each team that belongs to it
      divisionHistory: [], // an array of objects that contains each season championship winner (team and coach), cup winner (team and coach) and top scorer(s)
      teams: [], // an array of objects containing info about the teams, like current division and players
      topScorers: [], // an array of objects that contains each season top 10 scorers
      headToHead: [], // an array of objects, each one containing two teams id and their last head to head result
      coaches: [], // an array of objects containing info about each coach
      gamePlayers: [], // an array of objects containing info about each player's coach
      selectedTeam: null,
      infoHandler: new InfoHandler(base_info),
      standingsModalShow: false,
    };
  }

  handleClose = () => this.setState({standingsModalShow: false,});
  handleShow = () => this.setState({standingsModalShow: true,});

  renderDivision() {
    return (
      <Division handler = {this.state.infoHandler}/>
    );
  }

  renderStandings() {
    return (
      <Standings
      handler = {this.state.infoHandler}
      handleClose={this.handleClose}
      show={this.state.standingsModalShow}/>
    );
  }

  renderTeamHome(team, opponent) {
    const teamStandings = this.state.currentDivisions[0][0];
    const opponentStandings = this.state.currentDivisions[0][1];
    return (
      <TeamHome team = {team} opponent = {opponent}
      teamStandings = {teamStandings} opponentStandings = {opponentStandings}
      showStandings={(code)=>this.showStandings(code)} season = {this.state.season}
      handler = {this.state.infoHandler} ready = {()=>this.setState({screen: "matches"})}/>
    );
  }

  renderTeamInfo(team) {
    return (
      <TeamInfo
      team = {team}
      showTeamInfo = {()=>null}
      handler = {this.state.infoHandler}/>
    );
  }

  disabledButton(button){
    return (this.state.screen === button) ? ' disabled' : '';
  }

  showStandings(code){
    if(code === 'C' || code === 'c'){
      this.handleShow()
    }
  }

  showTeamInfo(team){
    this.setState({
      screen: "teamInfo",
      selectedTeam: team
    });
  }

  renderGame() {
    let screenBoard = null;
    switch(this.state.screen){
      case "matches":
        screenBoard = this.renderDivision();
        break;
      case "standings":
        screenBoard = this.renderStandings();
        break;
      case "teamHome":
        const humanTeam = this.state.infoHandler.get("Human",1,"team");
        screenBoard = this.renderTeamHome(humanTeam, this.state.infoHandler.get("Team",humanTeam,"next opponent"));
        break;
      case "teamInfo":
        screenBoard = this.renderTeamInfo(2/*this.state.selectedTeam*/);
        break;
      default:
        screenBoard = null;
    }
    return (
      <div className="game">
        <div className="game-board">
          <button onClick={()=>this.setState({screen:"matches"})} disabled={this.disabledButton("matches")}>Matches</button>
          <button onClick={()=>this.showStandings('c')} disabled={this.disabledButton("standings")}>Standings</button>
          <button onClick={()=>this.setState({screen:"teamHome"})} disabled={this.disabledButton("teamHome")}>Team Home</button>
          <button onClick={()=>this.setState({screen:"teamInfo"})} disabled={this.disabledButton("teamInfo")}>Team Info</button>
          {screenBoard}
          {this.renderStandings()}
        </div>
      </div>
    );
  }

  startGame() {
    this.state.infoHandler.initialization("Initialize", [])
    this.setState({screen: "teamHome"})
  }

  renderStart() {
    return (
      <div className="game">
        <div className="game-board">
          <GameInitializer handler = {this.state.infoHandler} startGame = {() => this.startGame()}/>
        </div>
      </div>
    );
  }

  render() {
    //let screenBoard = null;
    if (this.state.screen === "Start") {
      return this.renderStart()
    } else {
      return this.renderGame()
    }
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
