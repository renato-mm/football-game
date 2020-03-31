import React from 'react';

export default function TeamHomeMenuFormation(props) {

    const formations = [];
    [["1","3-3-4"],["2","3-4-3"],["3","4-2-4"],["4","4-3-3"],
    ["5","4-4-2"],["6","4-5-1"],["7","5-2-3"],["8","5-3-2"],
    ["9","5-4-1"],["0","6-3-1"],["A","Automático"],["M","Melhores"]].forEach(e => {
      formations.push(
        <tr onClick={()=>props.formationSelected(e[0])}>
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
