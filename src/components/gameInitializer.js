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

  renderTeamRec(teamID) {
    let tb = this.props.handler.initialization("Get", teamID)
    let color1 = tb[0]
    let color2 = tb[1]
    let name = tb[2]
    return (
    <div style = {{backgroundColor:color1, color:color2}}  className = "selectionName">{name} </div>
    )
  }

  renderNew(){
    return (
      <div className = {"newBox"}>
        <div className = {"teamsOut"}>
          {this.state.teamsOut.map((e) => {
            return (
              <div
                className = {"selectionDiv"} 
                key = {e}
              >
                {this.renderTeamRec(e)}
                <button 
                  className = {"removeButton"} 
                  onClick = {() => {this.props.handler.initialization("Add", [e]); this.getTeams()}}
                  >
                +
                </button>
              </div>
            )
          })}
        </div>
        <div className = {"teamsIn"}>
          {this.state.teamsIn.map((e) => {
            return (
              <div
                className = {"selectionDiv"} 
                key = {e}
              >
                {this.renderTeamRec(e)}
                <button 
                  className = {"addButton"} 
                  onClick = {() => {this.props.handler.initialization("Remove", [e]); this.getTeams()}}
                  >
                -
                </button>
                <button  
                  className = {"playerAddButton"} 
                  onClick = {() => {this.props.handler.initialization("Player", [e]); this.getTeams()}}
                  > 
                *
                </button>
              </div>
            )
          })}
        </div>
        <div className = {"startColumn"}>
          <button className = {"startGame"} onClick = {this.props.startGame}> Start Game </button>
          <div className = {"playersTeams"}>
            Player 1:{this.renderTeamRec(this.props.handler.initialization("Get Player", [1]))}
          </div>
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