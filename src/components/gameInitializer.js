import React from 'react';
import './gameInitializer.css';

export default class GameInitializer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      screen: "Start",
      gameStarted: false,
      teamsIn: this.props.handler.initialization("Teams In", 0),
      teamsOut: this.props.handler.initialization("Teams Out", 0),
    };
  }

  renderStart(){
    return (
      <div className = {"startBox"}>
        <button onClick = {() => this.setState({screen: "New Game"})}> New Game </button>
        <button onClick = {() => this.setState({screen: "Load Game"})}> Load Game </button>
      </div>
    );
  }

  getTeams() {
    let TO = this.props.handler.initialization("Teams Out", 0)
    let TI = this.props.handler.initialization("Teams In", 0)
    this.setState({teamsIn: TI, teamsOut: TO})
  }

  renderNew(){
    return (
      <div className = {"newBox"}>
        <div className = {"teamsIn"}>
          {this.state.teamsIn.map((e) => {
            let color1 = "background-color:" + e.color1 + ";"
            let color2 = "color:" + e.color2 + ";"
            let color = color1 + color2
            return (
              <button style = {{backgroundColor:e.color1, color:e.color2}} className = {"selectionButton"} key = {e.id} onClick = {() => {this.props.handler.initialization("Remove", [e.id]); this.getTeams()}}> {e.name} </button>
            )
          })}
        </div>
        <div className = {"teamsOut"}>
          {this.state.teamsOut.map((e) => {
            let color1 = "background-color:" + e.color1 + ";"
            let color2 = "color:" + e.color2 + ";"
            let color = color1 + color2
            return (
              <button style = {{backgroundColor:e.color1, color:e.color2}} className = {"selectionButton"} key = {e.id} onClick = {() => {this.props.handler.initialization("Add", [e.id]); this.getTeams()}}> {e.name} </button>
            )
          })}
        </div>
        <div>
          <button className = {"startGame"} onClick = {this.props.startGame}> Start Game </button>
        </div>
      </div>
    );
  }

  renderLoad(){
    return (null)
  }
  
  render(){
    if (this.state.screen === "Start") {
      return this.renderStart()
    } else if (this.state.screen === "New Game") {
      return this.renderNew()
    } else if (this.state.screen === "Load Game") {
      return this.renderLoad()
    }
  }
}