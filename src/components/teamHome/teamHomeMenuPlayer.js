import React from 'react';

export default function TeamHomeMenuPlayer(){

  const list = [];
  ["Sell","Players under observation","Search","Last transfers","Acquisitions"].forEach(e => {
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
