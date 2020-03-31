import React from 'react';

export default function TeamHomeMenuTeam(){

  const list = [];
  ["Ask Loan / Pay Debt", "Stadium", "History"].forEach(e => {
    list.push(
      <tr>
        <td>{e}</td>
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
