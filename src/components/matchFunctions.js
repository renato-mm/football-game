
// Create a function that receives two list of players as parameters
// The function must alter the history, homeScore and awayScore states of the match object it belongs to
// 'match.js' has a history example on line 22
// 'teams.js' has two samples of players list, but the function only receives the ones that are currently playing

export default function runMatch(home, away, history, time){
  //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
  let teams = [home, away]
  let event_chance = {"A" : 50, "M" : 40, "D" : 10, "G" : 1}
  let player
  let possession
  let enemy
  let lastH = history[history.length - 1]
  if (lastH.text === "Match Start"){
    let p = Math.floor(Math.random() * 2)
    possession = teams[p]
    let e = 0
    if (p === 1) {
      e = 0
    } else {
      e = 1
    }
    enemy = teams[e] 
    player = possession.players.filter( e => e.position === "A" && e.starting === 1 )[0]
  } else {
    possession = teams.filter(e => e.id === lastH.teamID)[0]
    enemy = teams.filter(e => e.id !== lastH.teamID)[0]
    player = possession.players.filter( e => e.id === lastH.playerID )[0]
  }

  let historyElements = []
  //let historyElement = {time: time,  stat:'N',  text: "Error", teamID: possession.id, playerID: '0', player:'0'}

  let event_roll = Math.floor(Math.random() * 100)
  let success_roll = Math.floor(Math.random() * 100)
  if (event_roll < event_chance[player.position]) {
    let event = "Goal Attempt"
    if (success_roll < 10) {
      let eventSuccess = true
      historyElements.push({time: time,  stat:'Goal',  text: "Goal", teamID: possession.id, playerID: player.id, player: player.name})
      let ePlayer = enemy.players.filter( e => e.position === "A" && e.starting === 1 )[0]
      historyElements.push({time: time,  stat:'Start',  text: "Start", teamID: enemy.id, playerID: ePlayer.id, player: ePlayer.name})
    } else {
      let eventSuccess = false
      let enemyGK = enemy.players.filter( e => e.position === "G" && e.starting === 1 )[0]
      historyElements.push({time: time,  stat:'Save',  text: "Save", teamID: enemy.id, playerID: enemyGK.id, player: enemyGK.name})
    }
  } else {
    let event = "Pass Attempt"
    if (success_roll < 70) {
      let eventSuccess = true
      let possessionPS = possession.players.filter( e => e.starting === 1 )
      let l = possessionPS.length
      let r = Math.floor(Math.random() * l)
      let possessionP = possessionPS[r]
      historyElements.push({time: time,  stat:'Pass',  text: "Pass", teamID: possession.id, playerID: possessionP.id, player: possessionP.name})
    } else {
      let eventSuccess = false
      let enemyPS = enemy.players.filter( e => e.starting === 1 )
      let l = enemyPS.length
      let r = Math.floor(Math.random() * l)
      let enemyP = enemyPS[r]
      historyElements.push({time: time,  stat:'Steal',  text: "Steal", teamID: enemy.id, playerID: enemyP.id, player: enemyP.name})
    }

  }

  return historyElements


}