import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import GameInitializer from './components/gameInitializer';
import {base_info} from './clubs/clubs';
import {InfoHandler} from './components/infoHandler';
import Division from './components/division';
import News from './components/news';
import Standings from './components/standings';
import TeamHome from './components/teamHome';
import TeamInfo from './components/teamInfo';
import Market from './components/playerMarket';

/*
const currDivs = [
  {teamID: 'cruzeiro1921', color1: "blue", color2: "white", team: 'Cruzeiro', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'atletico1906', color1: "black", color2: "white", team: 'Atlético-MG', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'flamengo1895', color1: "red", color2: "black", team: 'Flamengo', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0},
  {teamID: 'liverpool1892', color1: "red", color2: "white", team: 'Liverpool', wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0}
]
*/

class Game extends React.Component {
  constructor(props){
    super(props);
    const handler = new InfoHandler(base_info);
    this.state = {
      lastScreen: null,
      screen: "Start", // a string that represents the current game screen
      //season: 2020,
      //currentDivisions: [currDivs], // an array of lists, each one representing a single division containing its rank and a list of objects with current standings info of each team that belongs to it
      //divisionHistory: [], // an array of objects that contains each season championship winner (team and coach), cup winner (team and coach) and top scorer(s)
      //teams: [], // an array of objects containing info about the teams, like current division and players
      //topScorers: [], // an array of objects that contains each season top 10 scorers
      //headToHead: [], // an array of objects, each one containing two teams id and their last head to head result
      //coaches: [], // an array of objects containing info about each coach
      //gamePlayers: [], // an array of objects containing info about each player's coach
      selectedTeam: 1,
      infoHandler: handler,
      humanTeam: handler.get("Human",1,"team"),
      selectedPlayer: null,
    };
    handler.set("Saved State", 0, 'hasTeamHome', false);
    handler.set("Saved State", 0, 'teamHome', "");
    handler.set("Saved State", 0, 'hasMarket', false);
    handler.set("Saved State", 0, 'market', "");
  }

  handleKeyPress(event) {
    let key = event.key
    if (key === "p") {
      if (this.state.screen !== "matches" && this.state.screen !== "Start") {
        this.setState({lastScreen: this.state.screen, screen:"matches"})
      }
    }
  }

  matchesEvents(event) {
    if (event === "End") {
      this.setState({lastScreen: this.state.screen, screen: "news"})
    }
  }

  renderDivision() {
    let currentPlayer = this.state.infoHandler.get("Human", 0, "current")
    let buttonColors = this.state.infoHandler.get("Human", currentPlayer, "team colors")
    return (
      <Division
      handler = {this.state.infoHandler}
      matchesCallback = {(e) => this.matchesEvents(e)}
      buttonColors = {buttonColors}/>
    );
  }

  renderNews() {
    let currentPlayer = this.state.infoHandler.get("Human", 0, "current")
    let buttonColors = this.state.infoHandler.get("Human", currentPlayer, "team colors")
    return (
      <News
      handler = {this.state.infoHandler}/>
    );
  }

  renderStandings() {
    return (
      <Standings
      handler = {this.state.infoHandler}
      showTeamInfo = {(team)=>this.showTeamInfo(team,null)}/>
    );
  }

  renderTeamHome(team, opponent) {
    return (
      <TeamHome
      team = {team} opponent = {opponent} season = {this.state.infoHandler.get("Season",0,'year')}
      showTeamInfo = {(opp)=>this.showTeamInfo(opp,null)}
      showStandings={(code)=>this.showStandings(code)}
      showMarket={(team)=>this.showMarket(team)}
      handler = {this.state.infoHandler} ready = {()=>this.setState({lastScreen: this.state.screen, screen: "matches"})}/>
    );
  }

  renderTeamInfo(team, player) {
    return (
      <TeamInfo
      team = {team}
      humanTeam = {this.state.humanTeam}
      handler = {this.state.infoHandler}
      player = {player}
      showTeamInfo = {()=>this.setState({lastScreen: this.state.screen, screen: this.state.lastScreen})}
      showMarket = {()=>this.showMarket(this.state.humanTeam)}/>
    );
  }

  renderPlayerMarket() {
    return (
      <Market
      team = {this.state.humanTeam}
      handler = {this.state.infoHandler}
      showTeamInfo = {(team, player)=>this.showTeamInfo(team, player)}
      close = {()=>this.setState({lastScreen: this.state.screen, screen: this.state.lastScreen})}/>
    );
  }

  disabledButton(button){
    if (this.state.screen === button) {return ' disabled'}
    if (this.state.screen === "matches") {return ' disabled'}
    return ''
  }

  showStandings(code){
    if(code === 'C' || code === 'c'){
      this.setState({
        lastScreen: this.state.screen,
        screen: "standings",
      });
    }
  }

  showTeamInfo(team, player){
    this.setState({
      lastScreen: this.state.screen,
      screen: "teamInfo",
      selectedTeam: team,
      selectedPlayer: player
    });
  }

  showMarket(team){
    this.setState({
      lastScreen: this.state.screen,
      screen: "market",
      humanTeam: team,
    });
  }

  renderGame() {
    let currentPlayer = this.state.infoHandler.get("Human", 0, "current")
    let buttonColors = this.state.infoHandler.get("Human", currentPlayer, "team colors")
    let colors = {
      background: "#000",
      color: "#0F0",
      fontWeight: "bold",
    }
    let screenBoard = null;
    switch(this.state.screen){
      case "standings":
        screenBoard = this.renderStandings();
        break;
      case "teamHome":
        const humanTeam = this.state.infoHandler.get("Human",1,"team");
        screenBoard = this.renderTeamHome(humanTeam, this.state.infoHandler.get("Team",humanTeam,"next match"));
        break;
      case "teamInfo":
        screenBoard = this.renderTeamInfo(this.state.selectedTeam, this.state.selectedPlayer);
        break;
      case "news":
        screenBoard = this.renderNews();
        break
      case "matches":
        screenBoard = this.renderDivision();
        break
      case "market":
        screenBoard = this.renderPlayerMarket();
        break;
      default:
        screenBoard = null;
    }
    return (
      <div className="game" onKeyDown = {(event) => this.handleKeyPress(event)} tabIndex = "0">
        <div className="game-board">
          <div className = {"gameTopMenu"}>
            <button style = {colors} onClick={()=>this.setState({lastScreen: this.state.screen, screen:"matches"})} disabled={this.disabledButton("matches")}>Play Matches</button>
            <button style = {colors} onClick={()=>this.showStandings('c')} disabled={this.disabledButton("standings")}>Standings</button>
            <button style = {colors} onClick={()=>this.setState({lastScreen: this.state.screen, screen:"teamHome"})} disabled={this.disabledButton("teamHome")}>Team Home</button>
            <button style = {colors} onClick={()=>this.showTeamInfo(this.state.selectedTeam, this.state.selectedPlayer)} disabled={this.disabledButton("teamInfo")}>Team Info</button>
            <button style = {colors} onClick={()=>this.setState({lastScreen: this.state.screen, screen:"news"})} disabled={this.disabledButton("news")}>News</button>
          </div>
          {screenBoard}
        </div>
      </div>
    );
  }

  startGame() {
    this.state.infoHandler.initialization("Initialize", [])
    this.setState({lastScreen: this.state.screen, screen: "teamHome"})
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
