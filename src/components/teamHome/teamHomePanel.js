import React from 'react';
import './teamHomePanel.css';
import Match from './teamHomePanelMatch';
import Player from './teamHomePanelPlayer';
import Finance from './teamHomePanelFinance';
import Formation from './teamHomePanelFormation';
import Opponnent from './teamHomePanelOpponnent';
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
    this.opponnent = props.opponnent;
    this.teamStandings = props.teamStandings;
    this.opponnentStandings = props.opponnentStandings;
    this.colors = props.colors;
    this.oppColors = {
      background: props.opponnent.color1,
      color: props.opponnent.color2,
    };
    this.changePanel = props.changePanel;
    this.renewContract = props.renewContract;
    this.changeFocus = props.changeFocus;
    this.showOpponnentInfo = props.showOpponnentInfo;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      panel: nextProps.panel,
      selectedPlayer: nextProps.player,
    });  
  }

  renderMatch(){
    return <Match
    handler={this.handler}
    team={this.team}
    teamStandings={this.teamStandings}
    opponnentStandings={this.opponnentStandings}
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
    return <Formation handler={this.handler} players={this.handler.get("Team",this.team,"players")} auto={false}/>;
  }

  renderOpponnent(){
    return <Opponnent opponnent={this.opponnent} showOpponnentInfo={this.showOpponnentInfo}/>;
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
      case "opponnent":
        screenPanel = this.renderOpponnent();
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
          <div className = {"row nextMatch"}> Opponnent <span>{this.season}</span></div>
          <div style={this.oppColors} className = {"row nextMatchInfo"}> {this.opponnentStandings.team} <div>HOME - Fixture #4</div></div>
          <div className = {"teamHomePanel"}>
            {screenPanel}
          </div>
        </div>
        <div className = {"teamHomePanelMenu"}>
          <button onClick={()=>this.changePanel("match")} className={this.selectedButton("match")}>Match</button>
          <button onClick={()=>this.changePanel("player")} className={this.selectedButton("player")}>Player</button>
          <button onClick={()=>this.changePanel("finance")} className={this.selectedButton("finance")}>Finance</button>
          <button onClick={()=>this.changePanel("formation")} className={this.selectedButton("formation")}>Formation</button>
          <button onClick={()=>this.changePanel("opponnent")} className={this.selectedButton("opponnent")}>Opponnent</button>
        </div>
      </div>
    );
  }
}
