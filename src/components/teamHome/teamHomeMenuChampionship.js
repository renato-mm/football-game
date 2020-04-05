import React from 'react';

export default function TeamHomeMenuChampionship(props){

  return (
    <>
      <table className = {"teamHomeMenuTable"}>
        <tbody>
          <tr onClick={()=>props.showStandings('C')}>
            <td>Standings</td>
            <td>C</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">Top Scorers</td>
          </tr>
          <tr onClick={props.handleShow}>
            <td colSpan="2">Fixtures</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">Last champions</td>
          </tr>
          <tr onClick={()=>props.showStandings('')}>
            <td colSpan="2">All Time Top Scorers</td>
          </tr>
        </tbody>
      </table>
    </>
  );
  
}
