import React from 'react';

export default function TeamHomeMenuFormation(props) {

    const formations = [];
    [["F1","3-3-4"],["F2","3-4-3"],["F3","4-2-4"],["F4","4-3-3"],
    ["F5","4-4-2"],["F6","4-5-1"],["F7","5-2-3"],["F8","5-3-2"],
    ["F9","5-4-1"],["F10","5-5-0"],["F11","6-3-1"],["F12","6-4-0"],
    ["A","Automático"],["M","Melhores"]].forEach(e => {
      formations.push(
        <tr>
          <td>{e[1]}</td>
          <td>{e[0]}</td>
        </tr>);
    })
    return (
      <table className = {"teamHomeMenuTable"}>
        <tbody>
          {formations}
        </tbody>
      </table>
    );

}
