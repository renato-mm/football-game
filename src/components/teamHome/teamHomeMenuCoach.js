import React from 'react';

export default function TeamHomeMenuCoach(){

  const list = [];
  ["History","Coaches Management","Ranking","Profile"].forEach(e => {
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
