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
      team: props.team,
      panel: props.panel,
      selectedPlayer: props.player,
    };
    this.season = props.season;
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
      team: nextProps.team,
      panel: nextProps.panel,
      selectedPlayer: nextProps.player,
    });  
  }

  renderMatch(){
    return <Match
    teamStandings={this.teamStandings}
    opponnentStandings={this.opponnentStandings}
    colors={this.colors}
    oppColors={this.oppColors}
    cash={this.state.team.cash}
    moral={this.state.team.moral} />;
  }

  renderPlayer(){
    return <Player 
            player={this.state.selectedPlayer}
            changePanel={this.changePanel}/>;
  }

  renderFinance(){
    return <Finance finances={this.state.team.finances} season={this.season}/>;
  }

  renderFormation(){
    return <Formation players={this.state.team.players} auto={false}/>;
  }

  renderOpponnent(){
    return <Opponnent opponnent={this.opponnent} showOpponnentInfo={this.showOpponnentInfo}/>;
  }

  renderNewSalary(){
    return <NewSalary
            salary={this.state.selectedPlayer.salary}
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
