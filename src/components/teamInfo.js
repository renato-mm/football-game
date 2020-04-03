import React from 'react';
import './teamInfo.css';
import { IconContext } from "react-icons";
import { FaCheck } from "react-icons/fa";
import { FaPlusSquare } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import { AiOutlineBank } from "react-icons/ai";
import { GoCalendar } from "react-icons/go";
import { GiCash } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import countryInfo from "./countryFunctions";
import PlayerInfo from './teamHome/playerInfo';
import ProgressBar from 'react-bootstrap/ProgressBar'

export default class TeamInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      team: props.team,
      panel: "match",
      selectedPlayer: null,
    };
    this.colors = {
      background: props.team.color1,
      color: props.team.color2,
    };
    this.colorsPlayers = {
      background: props.team.color2,
      color: props.team.color1,
    };
    this.countryInfo = countryInfo(props.team.nationality);
    this.division = props.team.division > 0 ? "Division "+props.team.division : "No division";
    this.showTeamInfo = props.showTeamInfo;
    this.cash = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoCash"}}>
      <GiCash />
    </IconContext.Provider>;
    this.calendar = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
      <GoCalendar />
    </IconContext.Provider>;
    this.search = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
      <FaSearch />
    </IconContext.Provider>;
    this.buy = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoGreenBuy"}}>
      <GiMoneyStack />
    </IconContext.Provider>;
    this.bank = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
      <AiOutlineBank />
    </IconContext.Provider>;
    this.eye = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
      <FaRegEye />
    </IconContext.Provider>;
    this.list = <IconContext.Provider value={{className: "teamInfoIconSize"}}>
      <FaRegListAlt />
    </IconContext.Provider>;
    this.check = <IconContext.Provider value={{className: "teamInfoIconSize teamInfoGreenCheck"}}>
      <FaCheck />
    </IconContext.Provider>;
  }

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

  teamPlayers(){
    const teamPlayers = [];
    const teamPlys = this.state.team.players;
    ['G','D','M','F'].forEach(pos => {
      const plys = teamPlys.filter(e=>e.position === pos);
      plys.sort((e1,e2)=>e1.name>e2.name);
      for(let j = 0; j < plys.length; j++){
        const colors = this.state.selectedPlayer === plys[j] ? this.colorsPlayers : this.colors;
        const nat = plys[j].nationality === this.state.team.nationality ? ' ' : plys[j].nationality;
        const injsus = plys[j].injured ? <FaPlusSquare /> : plys[j].suspended ? <AiOutlineStop /> : '';
        teamPlayers.push(
          <tr style={colors}
              onClick={()=>this.selectPlayer(plys[j])}>
            <td>&nbsp;<b>{plys[j].position}</b></td>
            <td>&nbsp;<b>{plys[j].name}</b>&nbsp;</td>
            <td>&nbsp;<b>{plys[j].power}</b>&nbsp;</td>
            <td>&nbsp;<b>{injsus}</b>&nbsp;</td>
            <td>&nbsp;<b>{nat}</b>&nbsp;</td>
            <td>&nbsp;<b>{this.cashFormat(plys[j].cost)}</b>&nbsp;</td>
          </tr>);
      }
    });
    return teamPlayers;
  }

  moralColor = (moral) => {
    if(moral > 60){
      return 'success';
    }
    else if(moral > 30){
      return "warning";
    }
    else{
      return "danger";
    }
  }

  render(){
    return (
      <div
        style={this.colors}
        className = {"teamInfo"}>
        <div className = {"teamInfoHeader"}>
          <b>{this.state.team.fullName} ({this.countryInfo[0]})</b>
        </div>
        <div className = {"row col-md-12"}>
          <div className = {"col-md-7"}>
            <div className = {"row teamInfoSelection"}>
              <select>
                <option>Atlético-MG</option>
                <option>Cruzeiro</option>
                <option>Flamengo</option>
                <option>Liverpool</option>
              </select>
              <span> {this.division} </span>
            </div>
            <div className = {"row"}>
              <table className = {"teamInfoPlayers"}>
                <tbody>
                  {this.teamPlayers()}
                </tbody>
              </table>
            </div>
          </div>
          <div className = {"col-md-5"}>
            <ProgressBar className = {"teamInfoMoralBar"} variant={this.moralColor(this.state.team.moral)} now={this.state.team.moral} />
            <div className = {"teamInfoSupButtons"}>
              <button> {this.cash} Finances </button>
              <button> {this.calendar} Calendar </button>
            </div>
            <div className = {"teamInfoPlayer"}>
              <PlayerInfo player={this.state.selectedPlayer}/>
            </div>
            <div className = {"teamInfoInfButtons"}>
              <div>
                <button> {this.search} <span>Search</span> </button>
                <button> {this.buy} <span>Buy</span> </button>
                <button> {this.bank} <span>Loan</span> </button>
              </div>
              <div>
                <button disabled={this.state.selectedPlayer ? "" : "disabled"}> {this.eye} <span>Observed</span> </button>
                <button> {this.list} <span>List</span> </button>
                <button onClick={()=>this.showTeamInfo()}> {this.check} <span>Close</span> </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
