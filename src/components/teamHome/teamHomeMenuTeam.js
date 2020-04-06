import React from 'react';

export default function TeamHomeMenuTeam(props){

  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        <tr onClick={()=>props.handleShow('bankModalShow')}>
          <td>Ask Loan / Pay Debt</td>
        </tr>
        <tr onClick={()=>props.handleShow('stadiumModalShow')}>
          <td>Stadium</td>
        </tr>
        <tr onClick={()=>props.handleShow('teamHistoryModalShow')}>
          <td>History</td>
        </tr>
      </tbody>
    </table>
  );
  
}
