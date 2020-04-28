import React from 'react';
import './division.css';

export default class News extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          selectedNews: 0
      };
      this.handler = props.handler;
    }

    renderSeasonWinners(winners) {
        let leagueWinner = winners[0]
        let cupWinner = winners[1]
        let topGoalScorer = winners[2]
        let TGSteam = this.handler.get("Player", topGoalScorer, "teamID")
        return (
            <div>
                <div backgroundColor = {this.handler.get("Team", leagueWinner, "color1")} color = {this.handler.get("Team", leagueWinner, "color2")}>
                    {this.handler.get("Team", leagueWinner, "name")} {"Victory n: " + this.handler.get("Team", leagueWinner, "wins")[0]}
                </div>

                <div backgroundColor = {this.handler.get("Team", cupWinner, "color1")} color = {this.handler.get("Team", cupWinner, "color2")}>
                    {this.handler.get("Team", cupWinner, "name")} {"Victory n: " + this.handler.get("Team", cupWinner, "wins")[1]}
                </div>

                <div backgroundColor = {this.handler.get("Team", TGSteam, "color1")} color = {this.handler.get("Team", TGSteam, "color2")}>
                    {this.handler.get("Team", topGoalScorer, "name")} {"Victory n: " + this.handler.get("Team", topGoalScorer, "wins")[2]}
                </div>
            </div>
        )
    }

    renderNewsBoard(n) {
        if (n === undefined) {return (<></>)}
        return (
            <>
            {(n[0] === "Season Winners") ? this.renderSeasonWinners(n[1]) : n[1]}
            </>
        )
    }

    render() {
        let newsList = this.handler.get("Season", 0, "latest news")
        return (
            <>
            <div className = {"newsTopBar"}>
                1
                <button className = {"newsMoveButton"} disabled = {this.state.selectedNews === 0}> {"<<<"} </button>
                {this.state.selectedNews + 1}
                <button className = {"newsMoveButton"} disabled = {this.state.selectedNews === newsList.length - 1}> {">>>"} </button>
                {newsList.length}
            </div>
            <div className = {"newsBoard"}>
                {this.renderNewsBoard(newsList[this.state.selectedNews])}
            </div>
            </>
        )
    }
}