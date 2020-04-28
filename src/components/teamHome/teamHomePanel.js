import React from 'react';
import './teamHomePanel.css';
import NewSalary from './teamHomePanelNewSalary';
import { FaCheck } from "react-icons/fa";
import { IconContext } from "react-icons";
import ProgressBar from 'react-bootstrap/ProgressBar'
import FixturesInfo from './fixturesInfo';
import countryInfo from "../countryFunctions";
import PlayerInfo from './playerInfo';

export default class TeamHomePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = props.handler.get("Saved State", 0, 'hasTeamHome') ?
    JSON.parse(props.handler.get("Saved State", 0, 'teamHomePanel')) : 
    {
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
      this.cup = props.nextMatch[0][5];
      const comp = this.cup === "League" ? "Fixture #"+props.nextMatch[0][7] : props.nextMatch[0][6];
      const division = this.handler.get("Team",this.opponent,"league division") > 0 ? "Division "+this.handler.get("Team",this.opponent,"league division") : "No division";
      this.oppName = this.cup === "League" ? this.handler.get("Team",this.opponent,"name") : this.handler.get("Team",this.opponent,"name")+" ("+division+")";
      this.oppInfo = location+" - "+comp;
      this.oppColors = {
        background: this.handler.get("Team",this.opponent,"color1"),
        color: this.handler.get("Team",this.opponent,"color2"),
      };
      this.headToHead = this.nextMatch[1];
    }
    else{
      this.oppName = "Rest (no match)";
      this.oppInfo = "";
      this.opponent = null;
      this.oppColors = {
        background: 'white',
        color: 'black',
      };
      this.headToHead = null;
      this.cup = null;
    }
    this.changePanel = props.changePanel;
    this.renewContract = props.renewContract;
    this.changeFocus = props.changeFocus;
    this.showOpponentInfo = props.showOpponentInfo;
    this.ready = props.ready;
  }

  componentWillUnmount() {
    this.handler.set("Saved State", 0, 'teamHomePanel', JSON.stringify(this.state));
  }

  static getDerivedStateFromProps(props, state) {
    return {
      panel: props.panel,
      selectedPlayer: props.player,
    };  
  }

  renderMatch(){
    return <TeamHomePanelMatch
          handler={this.handler}
          team={this.team}
          opponent={this.opponent}
          cup={this.cup}
          headToHead={this.headToHead}
          colors={this.colors}
          oppColors={this.oppColors}
          cash={this.handler.get("Team",this.team,"finances")[0]}
          moral={this.handler.get("Team",this.team,"moral")} />;
  }

  renderPlayer(){
    return <TeamHomePanelPlayer
            handler={this.handler}
            player={this.state.selectedPlayer}
            changePanel={this.changePanel}/>;
  }

  renderFinance(){
    return <TeamHomePanelFinance
            finances={this.handler.get("Team",this.team,"finances")}
            season={this.season}/>;
  }

  renderFormation(){
    return <TeamHomePanelFormation
            handler={this.handler}
            players={this.handler.get("Team",this.team,"players")}
            auto={false}
            ready={this.ready}/>;
  }

  renderOpponent(){
    return <TeamHomePanelOpponent 
            handler={this.handler}
            opponent={this.opponent}
            showOpponentInfo={this.showOpponentInfo}/>;
  }

  renderNewSalary(){
    return <NewSalary
            handler={this.handler}
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
        screenPanel = !this.opponent ? null : this.renderOpponent();
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

function TeamHomePanelFinance(props){

  const cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: "name",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div>
      <table className = {"teamHomePanelFinance"}>
        <thead>
          <tr>
            <th>Season</th>
            <th>{props.season}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="2">Incomes</th>
          </tr>
          <tr>
            <td>Tickets</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Players sold</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Prizes</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th colSpan="2">Expenses</th>
          </tr>
          <tr>
            <td>Salaries</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Players bought</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Stands</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Interest</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Total income</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Total expense</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
      </table>
      <table className = {"teamHomePanelFinanceCurrent"}>
        <tbody>
          <tr>
            <td>Total salaries</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Loan interest</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Current cash</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Tickets cost</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
}

function TeamHomePanelFormation(props) {

    let disabled = true;
    let starters = props.players.filter(e=>props.handler.get("Player",e,"situation")[0] === 1);
    let reserves = props.players.filter(e=>props.handler.get("Player",e,"situation")[0] === 2);
    let keepers = starters.filter(e=>props.handler.get("Player",e,"position") === 'G');
    if(starters.length === 11 && reserves.length < 8 && !props.auto){
      if(keepers.length === 1){
        disabled = false;
      }
    }

    const check = <IconContext.Provider value={{className: "teamHomePanelFormationGreenCheck"}}>
      <FaCheck />
    </IconContext.Provider>;
    
    return (
      <div className = {"teamHomePanelFormation"}>
        <button onClick={props.ready} disabled={disabled ? 'disabled' : ''}> {check} Ready! </button>
      </div>
    );

}

function TeamHomePanelMatch(props){

  const headToHead = [];
  if(props.cup && props.cup === "League"){
    const teamStandings = props.handler.get("Team",props.team,"standing");
    const opponentStandings = props.handler.get("Team",props.opponent,"standing");
    headToHead.push(
    <tbody key={"standings"}>
      <tr key={"teamStandings"} style={props.colors}>
        <td>{props.handler.get("Team",props.team,"name")}</td>
        <td>&nbsp;{teamStandings[1]}&nbsp;</td>
        <td>&nbsp;{teamStandings[2]}&nbsp;</td>
        <td>&nbsp;{teamStandings[3]}&nbsp;</td>
        <td>&nbsp;{teamStandings[4]}&nbsp;:&nbsp;{teamStandings[5]}&nbsp;</td>
        <td>{teamStandings[6]}</td>
      </tr>
      <tr key={"opponentStandings"} style={props.oppColors}>
        <td>{props.handler.get("Team",props.opponent,"name")}</td>
        <td>&nbsp;{opponentStandings[1]}&nbsp;</td>
        <td>&nbsp;{opponentStandings[2]}&nbsp;</td>
        <td>&nbsp;{opponentStandings[3]}&nbsp;</td>
        <td>&nbsp;{opponentStandings[4]}&nbsp;:&nbsp;{opponentStandings[5]}&nbsp;</td>
        <td>{opponentStandings[6]}</td>
      </tr>
    </tbody>);
  }

  const h2h = props.headToHead;
  let h2hText = '';
  if(h2h){
    const cup = h2h[5] === 'League' ? 0 : 1;
    const home = h2h[0] === props.team ? "Home" : "Away";
    const fixture = !cup ? h2h[5]+" - Division "+h2h[6] : h2h[5]+" - "+h2h[6];
    const h2hResult = h2h[4] === 0 ? 'D' : h2h[4] === props.team ? 'W' : 'L';
    const homeName = props.handler.get("Team",h2h[0],"name");
    const awayName = props.handler.get("Team",h2h[1],"name");
    h2hText = <>{fixture+" ("+h2h[8]+"):"}<br/>{home}&nbsp;&nbsp;{homeName}&nbsp;&nbsp;{h2h[2]+":"+h2h[3]}&nbsp;&nbsp;{awayName}&nbsp;&nbsp;{h2hResult}</>;
  }
  else if(props.opponent){
    h2hText = <>{'First match between them!'}<br/></>;
  }
  else{
    h2hText = <br/>;
  }

  const cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: "name",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  const moralColor = (moral) => {
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

  return (
    <div>
      <div className = {"row"}>
        <table className = {"teamHomeHeadToHead"}>
          {headToHead}
        </table>
      </div>
      <div className = {"row"}>
        <div className = {"teamHomeLastHeadtoHead"}>
          Last head to head <div> <b>{h2hText}</b> </div>
        </div>
      </div>
      <div className = {"row teamHomeCash"}>
        <div> Cash </div>
        <div> {cashFormat(props.cash)} </div>
      </div>
      <div className = {"row teamHomeMoral"}>
        Moral
        <div> <ProgressBar className = {"teamHomeMoralBar"} variant={moralColor(props.moral)} now={props.moral} /> </div>
      </div>
    </div>
  );
  
}

function TeamHomePanelOpponent(props){

  const [oppFixturesModalShow, setOppFixturesModalShow] = React.useState(false);

  const handleClose = () => setOppFixturesModalShow(false);
  const handleShow = () => setOppFixturesModalShow(true);

  const oppColors = {
    background: props.handler.get("Team",props.opponent,"color1"),
    color: props.handler.get("Team",props.opponent,"color2"),
  };

  const moralColor = (moral) => {
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
  
  return (
    <>
      <div style={oppColors} className = {"row teamHomePanelOpponentName"}>
        <span>{props.handler.get("Team",props.opponent,"name")}</span>
      </div>
      <div className = {"row teamHomeOpponentMoralBar"}>
        <ProgressBar variant={moralColor(props.handler.get("Team",props.opponent,"moral"))} now={props.handler.get("Team",props.opponent,"moral")} />
      </div>
      <div className = {"row teamHomeOpponentCoach"}>
        Coach <span>{props.handler.get("Player",props.handler.get("Team",props.opponent,"coach"),"name")}</span>
      </div>
      <div className = {"row teamHomeOpponentButtons"}>
        <button onClick={handleShow}> Fixtures </button>
        <button onClick={()=>props.showOpponentInfo(props.opponent)}> Roster </button>
      </div>
      <FixturesInfo
      handler={props.handler}
      team={props.opponent}
      handleClose={handleClose}
      show={oppFixturesModalShow}/>
    </>
  );
  
}

function TeamHomePanelPlayer(props){

  if(props.player === null)
    return null;

  const countryInfos = countryInfo(props.handler.get("Player",props.player,"nationality"));

  return (
    <div>
      <div className = {"row teamHomePanelPlayer"}>
        <div> <span>{props.handler.get("Player",props.player,"name")}</span> </div>
        <div> {countryInfos[1]} {countryInfos[0]} </div>
      </div>
      <PlayerInfo handler={props.handler} player={props.player}/>
      <div className = {"row"}>
        <button className = {"teamHomePanelContract"}
                onClick={()=>props.changePanel("newSalary")}
                disabled={props.handler.get("Player",props.player,"contract")[0] !== 0 ? "disabled" : ''}>
          Renew Contract
        </button>
      </div>
    </div>
  );
  
}
