import React from 'react';
import './teamHomePanel.css';
import Match from './teamHomePanelMatch';
import Player from './teamHomePanelPlayer';
import Finance from './teamHomePanelFinance';
import Formation from './teamHomePanelFormation';
import Opponnent from './teamHomePanelOpponnent';

export default class TeamHomePanel extends React.Component {
  constructor(props){
    console.log(props.panel)
    super(props);
    this.state = {
      team: props.team,
      opponnent: props.opponnent,
      teamStandings: props.teamStandings,
      opponnentStandings: props.opponnentStandings,
      colors: props.colors,
      oppColors: {
        background: props.opponnent.color1,
        color: props.opponnent.color2,
      },
      panel: props.panel,
      selectedPlayer: props.player,
      changePanel: props.changePanel,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      panel: nextProps.panel,
      selectedPlayer: nextProps.player,
    });  
  }

  renderMatch(){
    return <Match
    teamStandings={this.state.teamStandings}
    opponnentStandings={this.state.opponnentStandings}
    colors={this.state.colors}
    oppColors={this.state.oppColors}
    cash={this.state.team.cash}
    moral={this.state.team.moral} />;
  }

  renderPlayer(){
    console.log(this.state.selectedPlayer)
    return <Player player={this.state.selectedPlayer} />;
  }

  renderFinance(){
    return <Finance />;
  }

  renderFormation(){
    return <Formation />;
  }

  renderOpponnent(){
    return <Opponnent />;
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
      default:
        screenPanel = null;
    }
    return (
      <div>
        <div className = {"panel"}>
          <div className = {"row nextMatch"}> Next Match <span>Current Year</span></div>
          <div style={this.state.oppColors} className = {"row nextMatchInfo"}> {this.state.opponnentStandings.team} <div>HOME - Fixture #4</div></div>
          {screenPanel}
        </div>
        <div className = {"teamHomePanelMenu"}>
          <button onClick={()=>this.state.changePanel("match")} className={this.selectedButton("match")}>Match</button>
          <button onClick={()=>this.state.changePanel("player")} className={this.selectedButton("player")}>Player</button>
          <button onClick={()=>this.state.changePanel("finance")} className={this.selectedButton("finance")}>Finance</button>
          <button onClick={()=>this.state.changePanel("formation")} className={this.selectedButton("formation")}>Formation</button>
          <button onClick={()=>this.state.changePanel("opponnent")} className={this.selectedButton("opponnent")}>Opponnent</button>
        </div>
      </div>
    );
  }
}
