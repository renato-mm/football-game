import React from 'react';

export default function TeamHomeMenuFormation(props) {

  const gks = props.players.filter(e=>props.handler.get("Player",e,"position")==="G").length;
  const def = props.players.filter(e=>props.handler.get("Player",e,"position")==="D").length;
  const mid = props.players.filter(e=>props.handler.get("Player",e,"position")==="M").length;
  const fwd = props.players.filter(e=>props.handler.get("Player",e,"position")==="F").length;
  const formations = [];
  [["1","3-3-4"],["2","3-4-3"],["3","4-2-4"],["4","4-3-3"],
  ["5","4-4-2"],["6","4-5-1"],["7","5-2-3"],["8","5-3-2"],
  ["9","5-4-1"],["0","6-3-1"],["A","Automático"],["M","Melhores"]].forEach(e => {
    const color = {color: "gray"};
    const disable = e[0] !== 'A' && e[0] !== 'M' && (gks < 1 ||
                    def < parseInt(e[1].slice(0,1)) ||
                    mid < parseInt(e[1].slice(2,3)) ||
                    fwd < parseInt(e[1].slice(4)));
    formations.push(
      <tr key={e[0]} style={disable ? color : {}} onClick={()=>props.formationSelected(e[0])}>
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
