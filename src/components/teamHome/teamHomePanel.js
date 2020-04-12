import React from 'react';
import './teamHomePanel.css';
import Match from './teamHomePanelMatch';
import Player from './teamHomePanelPlayer';
import Finance from './teamHomePanelFinance';
import Formation from './teamHomePanelFormation';
import Opponent from './teamHomePanelOpponent';
import NewSalary from './teamHomePanelNewSalary';

export default class TeamHomePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      panel: props.panel,
      selectedPlayer: props.player,
    };
    this.handler = props.handler;
    this.season = props.season;
    this.team = props.team;
    this.nextMatch = props.nextMatch;
    this.colors = props.colors;
    if(props.nextMatch){
      const location = props.nextMatch[0][0] === props.team ? "Home" : "Away";
      this.opponent = location === "Home" ? props.nextMatch[0][1] : props.nextMatch[0][0];
      const comp = props.nextMatch[0][5] === "League" ? "Fixture #"+props.nextMatch[0][7] : props.nextMatch[0][6];
      const division = this.handler.get("Team",this.opponent,"League division") > 0 ? "Division "+this.handler.get("Team",this.opponent,"League division") : "No division";
      this.oppName = props.nextMatch[0][5] === "League" ? this.handler.get("Team",this.opponent,"name") : this.handler.get("Team",this.opponent,"name")+" ("+division+")";
      this.oppInfo = location+" - "+comp;
      this.oppColors = {
        background: this.handler.get("Team",this.opponent,"color1"),
        color: this.handler.get("Team",this.opponent,"color2"),
      };
    }
    else{
      this.oppName = "Rest (no match)";
      this.oppInfo = "";
      this.opponent = null;
      this.oppColors = {
        background: 'white',
        color: 'black',
      };
    }
    this.changePanel = props.changePanel;
    this.renewContract = props.renewContract;
    this.changeFocus = props.changeFocus;
    this.showOpponentInfo = props.showOpponentInfo;
    this.ready = props.ready;
  }

  static getDerivedStateFromProps(props, state) {
    return {
      panel: props.panel,
      selectedPlayer: props.player,
    };  
  }

  renderMatch(){
    return <Match
          handler={this.handler}
          team={this.team}
          opponent={this.opponent}
          headToHead={this.nextMatch[1]}
          colors={this.colors}
          oppColors={this.oppColors}
          cash={this.handler.get("Team",this.team,"cash")}
          moral={this.handler.get("Team",this.team,"moral")} />;
  }

  renderPlayer(){
    return <Player
            handler={this.handler}
            player={this.state.selectedPlayer}
            changePanel={this.changePanel}/>;
  }

  renderFinance(){
    return <Finance finances={this.handler.get("Team",this.team,"finances")} season={this.season}/>;
  }

  renderFormation(){
    return <Formation
            handler={this.handler}
            players={this.handler.get("Team",this.team,"players")}
            auto={false}
            ready={this.ready}/>;
  }

  renderOpponent(){
    return <Opponent 
            handler={this.handler}
            opponent={this.opponent}
            showOpponentInfo={this.showOpponentInfo}/>;
  }

  renderNewSalary(){
    return <NewSalary
            salary={this.handler.get("Player",this.state.selectedPlayer,"contract")}
            renewContract={this.renewContract}
            changePanel={this.changePanel}
            changeFocus={this.changeFocus}/>;
  }

  selectedButton(button){
    return (this.state.panel === button) ? 'teamHomePanelMenuActive' : '';
  }

  render(){
    let screenPanel = null;
    switch(this.state.panel){
      case "match":
        screenPanel = this.renderMatch();
        break;
      case "player":
        screenPanel = this.renderPlayer();
        break;
      case "finance":
        screenPanel = this.renderFinance();
        break;
      case "formation":
        screenPanel = this.renderFormation();
        break;
      case "opponent":
        screenPanel = this.renderOpponent();
        break;
      case "newSalary":
        screenPanel = this.renderNewSalary();
        break;
      default:
        screenPanel = null;
    }
    return (
      <div>
        <div className = {"panel"}>
          <div className = {"row nextMatch"}> Opponent <span>{this.season}</span></div>
          <div style={this.oppColors} className = {"row nextMatchInfo"}> {this.oppName} <div>{this.oppInfo}</div></div>
          <div className = {"teamHomePanel"}>
            {screenPanel}
          </div>
        </div>
        <div className = {"teamHomePanelMenu"}>
          <button onClick={()=>this.changePanel("match")} className={this.selectedButton("match")}>Match</button>
          <button onClick={()=>this.changePanel("player")} className={this.selectedButton("player")}>Player</button>
          <button onClick={()=>this.changePanel("finance")} className={this.selectedButton("finance")}>Finance</button>
          <button onClick={()=>this.changePanel("formation")} className={this.selectedButton("formation")}>Formation</button>
          <button onClick={()=>this.changePanel("opponent")} className={this.selectedButton("opponent")}>Opponent</button>
        </div>
      </div>
    );
  }
}
