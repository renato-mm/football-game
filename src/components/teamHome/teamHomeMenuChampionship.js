import React from 'react';

export default function TeamHomeMenuChampionship(props){

  const list = [];
  [["Standings","C"],["Top Scorers",''],["Fixtures",''],["Last champions",''],["All Time Top Scorers",'']].forEach(e => {
    list.push(
      <tr onClick={()=>props.showStandings(e[1])}>
        <td>{e[0]}</td>
        <td>{e[1]}</td>
      </tr>);
  })
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        {list}
      </tbody>
    </table>
  );
  
}
