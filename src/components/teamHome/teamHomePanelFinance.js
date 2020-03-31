import React from 'react';

export default function TeamHomeMenuFreefoot(){

  const list = [];
  /*["Options","Save","Load"].forEach(e => {
    list.push(
      <tr>
        <td>{e}</td>
      </tr>);
  })*/
  return (
    <table className = {"teamHomeMenuTable"}>
      <tbody>
        {list}
      </tbody>
    </table>
  );
  
}
