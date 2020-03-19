import React from 'react';
import './match.css';
import Attendance from './attendance';
import Team from './team';
import Scoreboard from './scoreboard';
import MatchStory from './matchStory';
import * as Teams from './teams';
import { IconContext } from "react-icons";
import { FaRegWindowClose } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import {AiTwotoneBook} from "react-icons/ai";

const attendance = 18500;
const goalIcon = <GiSoccerBall />;
const yellowCard = <IconContext.Provider value={{className: "yellowCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;
const redCard = <IconContext.Provider value={{className: "redCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;
const closeIcon = <FaRegWindowClose />;
const history = [
  {time: 9,  stat:'G',  text: goalIcon, team:'home', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 15, stat:'CA', text: yellowCard, team:'home', playerID: '2109', player:'Henrique'},
  {time: 16, stat:'CA', text: yellowCard, team:'home', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 25, stat:'CA', text: goalIcon, team:'away', playerID: '0609', player:'Pierre'},
  {time: 28, stat:'G',  text: goalIcon, team:'home', playerID: '2108', player:'Henrique'},
  {time: 33, stat:'G',  text: goalIcon, team:'home', playerID: '2113', player:'Marcelo Moreno'},
  {time: 35, stat:'CA', text: yellowCard, team:'away', playerID: '0602', player:'Júnior César'},
  {time: 44, stat:'CA', text: yellowCard, team:'home', playerID: '2104', player:'Egídio'},
  {time: 45, stat:'G',  text: goalIcon, team:'home', playerID: '2110', player:'Lucas Silva'},
  {time: 56, stat:'G',  text: goalIcon, team:'home', playerID: '2115', player:'Ricardo Goulart'},
  {time: 60, stat:'G',  text: goalIcon, team:'away', playerID: '0606', player:'Réver'},
  {time: 77, stat:'CV', text: redCard, team:'away', playerID: '0603', player:'Leonardo Silva'},
  {time: 77, stat:'CV', text: redCard, team:'home', playerID: '2115', player:'Ricardo Goulart'},
  {time: 89, stat:'G',  text: goalIcon, team:'home', playerID: '2116', player:'Willian'}
]

function TeamModal(props) {
  if(props.show === false){
    return null;
  }

  const colors = {
    background: props.team.color1,
    color: props.team.color2,
  };

  const teamPlys = props.team.players;
  const players = [];
  const reserves = [];

  [['G',1],['D',4],['M',3],['A',3]].forEach(pos => {
    const plys = teamPlys.filter(e=>e.position === pos[0]);
    plys.sort((e1,e2)=>e1.power<e2.power);
    for(let j = 0; j < pos[1]; j++){
      players.push(
        <tr>
          <td>{plys[j].position}</td>
          <td>&nbsp;{plys[j].name}&nbsp;</td>
          <td>{plys[j].power}</td>
        </tr>);
    }
    for(let j = pos[1]; j < plys.length; j++){
      reserves.push(
        <tr>
          <td>{plys[j].position}</td>
          <td>&nbsp;{plys[j].name}&nbsp;</td>
          <td>{plys[j].power}</td>
        </tr>);
    }
  });

  const hist = []
  for(let j = 0; j < history.length; j++){
    hist.push(
      <tr>
        <td>{history[j].time.toString().padStart(2, '0')}'</td>
        <td>&nbsp;{history[j].text}&nbsp;</td>
        <td>{history[j].player}</td>
      </tr>);
  }

  return (
    <div
      style = {colors}
      className = {"teamModal"}
    >
      <div className = {"teamModalHeader"}>
        <b>{props.score}</b>
        <div className = {"teamModalCloseButton"} onClick = { props.close }>{closeIcon}</div>
      </div>
      <table className = {"teamModalHistoryTable"}>
        {hist}
      </table>
      <b>{props.team.name}</b>
      <div className = {"teamModalPlayers"}>
        <table className = {"teamModalPlayersTable"}>
          {players}
        </table>
        <table className = {"teamModalReservesTable"}>
          {reserves}
        </table>
        <button className = {"teamModalSubButton"}><b>Substitute</b></button>
      </div>
    </div>
  );
}

export default class Match extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showHomeTeam: false,
      showAwayTeam: false,
      homeTeam: Teams.cruzeiro,
      awayTeam: Teams.atleticoMG,
      history: history,
      attendance: attendance,
      homeScore: 0,
      awayScore: 0
    };
  }

  renderAttendance(attend) {
    return (
      <Attendance attendance = {attend}/>
    );
  }

  renderModal(side) {
    let modal = null;
    if(side === "home" && this.state.showHomeTeam){
      const scoreboard = this.state.homeTeam.name+" "+this.state.homeScore+" - "+this.state.awayScore+" "+this.state.awayTeam.name;
      modal = <TeamModal team = {this.state.homeTeam} history = {this.state.history} score = {scoreboard} close = {() => this.switchModal("home")}/>;
    }
    else if(side === "away" && this.state.showAwayTeam){
      const scoreboard = this.state.homeTeam.name+" "+this.state.homeScore+" - "+this.state.awayScore+" "+this.state.awayTeam.name;
      modal = <TeamModal team = {this.state.awayTeam} history = {this.state.history} score = {scoreboard} close = {() => this.switchModal("away")}/>;
    }
    return modal;
  }

  renderTeam(side, team) {
    return (
      <Team side = {side} team = {team} teamClick = {() => this.switchModal(side)} />
    );
  }

  renderScoreboard(homeSc, awaySc) {
    return (
      <Scoreboard homeScore = {homeSc} awayScore = {awaySc}/>
    );
  }

  renderMatchStory(histText) {
    return (
      <MatchStory text = {histText}/>
    );
  }

  switchModal(side){
    this.updateMatch(this.state.history);
    if(side === "home"){
      this.setState({showHomeTeam: !this.state.showHomeTeam,})
    }
    else if(side === "away"){
      this.setState({showAwayTeam: !this.state.showAwayTeam,})
    }
  }

  updateMatch(newHistory){
    const homeSc = (newHistory.filter(e => e.stat === 'G' && e.team === 'home')).length;
    const awaySc = (newHistory.filter(e => e.stat === 'G' && e.team === 'away')).length;
    this.setState({
      homeScore: homeSc,
      awayScore: awaySc
    });
  }
  
  render(){
    const matchStoryText = this.state.history[this.state.history.length - 1];
    return (
      <div
        className = {"matchBox"}
      >
        {this.renderAttendance(this.state.attendance)}
        {this.renderTeam("home", Teams.cruzeiro)}
        {this.renderModal("home")}
        {this.renderScoreboard(this.state.homeScore, this.state.awayScore)}
        {this.renderTeam("away", Teams.atleticoMG)}
        {this.renderModal("away")}
        {this.renderMatchStory(matchStoryText.time+"'  "+matchStoryText.stat+": "+matchStoryText.player)}
      </div>
    );
  }
}

