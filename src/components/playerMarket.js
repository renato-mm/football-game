import React from 'react';
import './playerMarket.css';
import countryInfo from "./countryFunctions";

const strengthOptions = [["1 to 10",1,10], ["5 to 15",5,15], ["10 to 20",10,20], ["20 to 30",20,30], ["30 to 40",30,40], ["40 to 50",40,50]]
const positionOptions = [["Goalkeeper",'G',"G"], ["Defender","D","D"], ["Midfielder","M","M"], ["Forward","F","F"]]
const costOptions = [["Any",-Infinity,Infinity], ["0 to 200000",0,200000],
["200000 to 800000",200000,800000], ["800000 to 2000000",800000,2000000],
["2000000 to 4000000",2000000,4000000], ["4000000 to 10000000",4000000,10000000],
["10000000 to 20000000",10000000,20000000], ["Over 20000000",20000000,Infinity]]
const options = [strengthOptions, positionOptions, costOptions]
const countries = require('./countries.json')

export default class PlayerMarket extends React.Component {
  constructor(props){
    super(props);
    this.state = localStorage.getItem('hasMarketSavedState') === "true" ?
    JSON.parse(localStorage.getItem('marketSavedState')) : 
    {
      team: props.team,
      selectedPlayer: null,
      name: '',
      strength: '',
      position: '',
      nationality: '',
      cost: '',
      players: [],
    };
    this.handler = props.handler;
    this.showTeamInfo = props.showTeamInfo;
    this.close = props.close;
    this.selects = options.map(list=>
    list.map((e,index)=><option key={e[1]} value={index}>{e[0]}</option>))
    this.selectOfNations = countries.sort((e1,e2)=>countryInfo(e1)[0].localeCompare(countryInfo(e2)[0])).map(e=>{const nat=countryInfo(e); return <option key={e} value={e}>{nat[0]}</option>})
  }

  componentWillUnmount() {
    localStorage.setItem('hasMarketSavedState', "true");
    localStorage.setItem('marketSavedState', JSON.stringify(this.state))
  }

  handleChange = (event, state) => this.setState({
    [state]: event.target.value,
  });

  selectPlayer(player){
    this.setState({
      selectedPlayer: player,
    });
  }

  cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  updatePlayersList(){
    let teamPlys = this.handler.get("Player",0,"id");
    if(this.state.name !== ''){
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"name").toLowerCase().includes(this.state.name.toLowerCase()));
    }
    if(this.state.strength !== ''){
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"strength") >= strengthOptions[this.state.strength][1]);
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"strength") <= strengthOptions[this.state.strength][2]);
    }
    if(this.state.position !== ''){
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"position") === positionOptions[this.state.position][1]);
    }
    if(this.state.nationality !== ''){
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"nationality") === this.state.nationality);
    }
    if(this.state.cost !== ''){
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"contract")[0] === 0);
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"contract")[2] >= costOptions[this.state.cost][1]);
      teamPlys = teamPlys.filter(e=>this.handler.get("Player",e,"contract")[2] <= costOptions[this.state.cost][2]);
    }
    teamPlys = teamPlys.sort((e1,e2)=>this.handler.get("Player",e1,"name").localeCompare(this.handler.get("Player",e2,"name")));
    this.setState({
      players: teamPlys,
    });
  }

  playersForSale(){
    const teamPlayers = [];
    const teamPlys = this.state.players;
    for(let j = 0; j < teamPlys.length; j++){
      const colors = this.state.selectedPlayer === this.handler.get("Player",teamPlys[j],"id") ? 
      { background: "black", color: "white", } : {};
      const team = this.handler.get("Team",this.handler.get("Player",teamPlys[j],"teamID"),"name")
      const nat = this.handler.get("Player",teamPlys[j],"nationality");
      const contract = this.handler.get("Player",teamPlys[j],"contract");
      teamPlayers.push(
        <tr key={teamPlys[j]}
            style={colors}
            onClick={()=>this.selectPlayer(teamPlys[j])}>
          <td>{this.handler.get("Player",teamPlys[j],"position")}</td>
          <td><b>{this.handler.get("Player",teamPlys[j],"name")}</b></td>
          <td>{team}</td>
          <td>{this.handler.get("Player",teamPlys[j],"strength")}</td>
          <td>{nat}</td>
          <td><b>{contract[0] === 0 ? this.cashFormat(contract[2]) : ''}</b></td>
          <td>{this.handler.get("Player",teamPlys[j],"behaviour")}</td>
        </tr>);
    }
    return teamPlayers;
  }

  render(){
    return (
      <div className = {"playersMarket"}>
        <div className = {"playersMarketHeader"}>
          <b> Players Market </b>
        </div>
        <div className = {""}>
          <div className = {"playersMarketSelection"}>
            <div>
              <span>Name:</span>
              <input type={"textarea"} value={this.state.name} onChange={(event)=>this.handleChange(event, "name")} />
              <button onClick={()=>this.setState({name: ''})}> {} <span>Clear</span> </button>
            </div>
            <div>
              <span>Strength:</span>
              <select value={this.state.strength} onChange={(event)=>this.handleChange(event, "strength")}>
                <option hidden disabled value=''></option>
                {this.selects[0]}
              </select>
              <button onClick={()=>this.setState({strength: ''})}> {} <span>Clear</span> </button>
            </div>
            <div>
              <span>Position:</span>
              <select value={this.state.position} onChange={(event)=>this.handleChange(event, "position")}>
                <option hidden disabled value=''></option>
                {this.selects[1]}
              </select>
              <button onClick={()=>this.setState({position: ''})}> {} <span>Clear</span> </button>
            </div>
            <div>
              <span>Nationality:</span>
              <select value={this.state.nationality} onChange={(event)=>this.handleChange(event, "nationality")}>
                <option hidden disabled value=''></option>
                {this.selectOfNations}
              </select>
              <button onClick={()=>this.setState({nationality: ''})}> {} <span>Clear</span> </button>
            </div>
            <div>
              <span>Cost:</span>
              <select value={this.state.cost} onChange={(event)=>this.handleChange(event, "cost")}>
                <option hidden disabled value=''></option>
                {this.selects[2]}
              </select>
              <button onClick={()=>this.setState({cost: ''})}> {} <span>Clear</span> </button>
            </div>
          </div>
          <div className = {""}>
          </div>
        </div>
        <div className = {""}>
          <div className = {"playersMarketTable"}>
            <table>
              <tbody>
                {this.playersForSale()}
              </tbody>
            </table>
          </div>
          <div className = {"playersMarketButtons"}>
            <div>
              <button onClick={()=>this.updatePlayersList()}> {} <span>Search</span> </button>
              <button> {} <span>Team</span> </button>
              <button onClick={()=>this.close()}> {} <span>Close</span> </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
