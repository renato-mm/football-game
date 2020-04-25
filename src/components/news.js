import React from 'react';
import './division.css';

export default class Division extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          selectedNews: 0
      };
      this.handler = props.handler;
    }

    renderSeasonWinners() {

    }

    renderNewsBoard(n) {
        if (n === undefined) {return (<></>)}
        return (
            <>
            {n[1]}
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