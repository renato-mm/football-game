
/*["1","3-3-4"],["2","3-4-3"],["3","4-2-4"],["4","4-3-3"],
    ["5","4-4-2"],["6","4-5-1"],["7","5-2-3"],["8","5-3-2"],
    ["9","5-4-1"],["0","6-3-1"],["A","Automático"],["M","Melhores"]] */

export function selectFormation(handler, players, formation){
  const formations = [[6,3,1],[3,3,4],[3,4,3],[4,2,4],[4,3,3],
  [4,4,2],[4,5,1],[5,2,3],[5,3,2],[5,4,1]];
  let gk = 1, def, mid, fwd;
  if(formation !== 'A' && formation !== 'M' && formation !== 'a' && formation !== 'm'){
    gk = 1;
    def = formations[formation][0];
    mid = formations[formation][1];
    fwd = formations[formation][2];
  }
  else{
    gk = 1;
    def = 4;
    mid = 3;
    fwd = 3;
  }
  let count = 0;
  const teamPlys = players;
  [['G',gk],['D',def],['M',mid],['F',fwd]].forEach(pos => {
    const plys = teamPlys.filter(e=>(handler.get("Player",e,"position") === pos[0] && handler.get("Player",e,"situation")[0]<3));
    if(plys.length < pos[1]){
      count++;
    }
  });
  if(count === 0){
    [['G',gk],['D',def],['M',mid],['F',fwd]].forEach(pos => {
      const plys = teamPlys.filter(e=>(handler.get("Player",e,"position") === pos[0] && handler.get("Player",e,"situation")[0]<3));
      if(plys.length < pos[1]){
        return;
      }
      plys.sort((e1,e2)=>handler.get("Player",e1,"strength")<handler.get("Player",e2,"strength"));
      for(let j = 0; j < pos[1]; j++){
        handler.get("Player",plys[j],"situation")[0] = 1;
      }
      for(let j = pos[1]; j < plys.length; j++){
        handler.get("Player",plys[j],"situation")[0] = 2;
      }
    });
  }
  return teamPlys;
}