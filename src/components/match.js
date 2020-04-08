import React from 'react';
import './match.css';
import TeamModal from './teamModal';
import { IconContext } from "react-icons";
import { GiSoccerBall } from "react-icons/gi";
import {AiTwotoneBook} from "react-icons/ai";

const goalIcon = <GiSoccerBall />;
const redCard = <IconContext.Provider value={{className: "redCard"}}>
  <AiTwotoneBook />
</IconContext.Provider>;
const attendance = 18500;
const history = [{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}]
  /*
  {time: 9,  stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 15, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2109', player:'Henrique'},
  {time: 16, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2108', player:'Éverton Ribeiro'},
  {time: 25, stat:'CA', text: goalIcon, teamID:'atletico1906', playerID: '0609', player:'Pierre'},
  {time: 28, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2108', player:'Henrique'},
  {time: 33, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2113', player:'Marcelo Moreno'},
  {time: 35, stat:'CA', text: yellowCard, teamID:'atletico1906', playerID: '0602', player:'Júnior César'},
  {time: 44, stat:'CA', text: yellowCard, teamID:'cruzeiro1921', playerID: '2104', player:'Egídio'},
  {time: 45, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2110', player:'Lucas Silva'},
  {time: 56, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2115', player:'Ricardo Goulart'},
  {time: 60, stat:'G',  text: goalIcon, teamID:'atletico1906', playerID: '0606', player:'Réver'},
  {time: 77, stat:'CV', text: redCard, teamID:'atletico1906', playerID: '0603', player:'Leonardo Silva'},
  {time: 77, stat:'CV', text: redCard, teamID:'cruzeiro1921', playerID: '2115', player:'Ricardo Goulart'},
  {time: 89, stat:'G',  text: goalIcon, teamID:'cruzeiro1921', playerID: '2116', player:'Willian'}
  */

export default class Match extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      modalTeam: "",
      history: history,
      homeScore: 0,
      awayScore: 0,
    };
    this.ind = props.matchInd;
    this.handler = props.handler;
    this.homeTeam = props.homeTeam;
    this.awayTeam = props.awayTeam;
    this.attendance = attendance;
  }

  handleClose = () => this.setState({modalShow: false, modalTeam: "",});
  handleShow = (side) => this.setState({modalShow: true, modalTeam: side,});

  renderAttendance(attend) {
    return (
      <div className = {"attendance"} > Attendance: {attend} </div>
    );
  }

  renderTeam(side, team) {
    const  colors = {
      background: this.props.handler.get("Team", team, "color1"),
      color: this.props.handler.get("Team", team, "color2"),
    }
  
    return (
      <div
        style = {colors}
        className = {"team " + side}
        onClick = {() => this.handleShow(side)}
      >
        {this.props.handler.get("Team", team, "name")}
      </div>
    );
  }

  renderScoreboard(homeSc, awaySc) {
    return (
      <div className = {"scoreboard"}>
        <div className = {"leftScoreboard"} > <b>{homeSc}</b> &nbsp;</div>
        <div className = {"rightScoreboard"} > <b>{awaySc}</b> </div>
      </div>
    )
  }
  
  render(){
    //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
    let returnHistory = this.props.handler.get("Match", this.ind, "history")
    let homeID = this.props.handler.get("Match", this.ind, "home")
    let awayID = this.props.handler.get("Match", this.ind, "away")
    const history = returnHistory[0] 
    const homeSc = returnHistory[1]
    const awaySc = returnHistory[2]
    const matchStoryText = history[history.length - 1]
    let mText = ["-",'','']
    if (matchStoryText.time !== 0) { 
      const stat = matchStoryText.stat === "Goal" ? goalIcon : matchStoryText.stat;
      mText = [matchStoryText.time+"'  ",stat,": "+matchStoryText.player]
    }
    let matchStoryTextRender = (
      <div className = {"matchStory"} > {mText[0]}{mText[1]}{mText[2]} </div>
    )
    //console.log(history, matchStoryText)
    const scoreboard = this.handler.get("Team", homeID, "name") + " " + homeSc + " - " + awaySc + " " + this.handler.get("Team", awayID, "name");
    return (
      <div className = {"matchBox"} >
        {this.renderAttendance(this.state.attendance)}
        {this.renderTeam("home", homeID)}
        {this.renderScoreboard(homeSc, awaySc)}
        {this.renderTeam("away", awayID)}
        {matchStoryTextRender}
        <TeamModal
        handler={this.handler}
        team = {this.state.modalTeam === "home" ? homeID : awayID}
        history = {history}
        score = {scoreboard}
        show = {this.state.modalShow}
        handleClose = {this.handleClose}/>
      </div>
    );
  }
}

