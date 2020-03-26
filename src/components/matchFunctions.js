
// Create a function that receives two list of players as parameters
// The function must alter the history, homeScore and awayScore states of the match object it belongs to
// 'match.js' has a history example on line 22
// 'teams.js' has two samples of players list, but the function only receives the ones that are currently playing

function randomInt(l, h) {
  let c = Math.floor(Math.random() * (h - l)) + l
  return c
}

function runChance(chances) {
  if (typeof(chances) === typeof([])) {
    let chances_sum = chances.slice()
    let total = chances_sum.reduce((a, b) => a + b, 0)
    let c = randomInt(0, total)
    let i
    let sc = 0
    for (i = 0; i < chances.length; i++) {
      sc += chances[i]
      if (c < sc) {
        return i
      }
    }
  } else if (typeof(chances) === typeof(50)) {
    let c = randomInt(0, chances)
    if (c < chances) {
      return true
    } else {
      return false
    }
  }
}

export default function runMatch(home, away, history, time){
  //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
  let teams = [home, away]
  let event_chance = {"A" : 50, "M" : 20, "D" : 10, "G" : 1}
  let pass_choice = {"A": [50, 40, 10], "M": [50, 20, 30], "D": [20, 30, 50], "G": [5, 15, 80]}
  let pass_options = ["A", "M", "D", "G"]
  let inverse_positions = {"A" : "D", "M": "M", "D": "A", "G": "A"}
  let player
  let possession
  let enemy
  let lastH = history[history.length - 1]
  if (lastH.text === "Match Start"){
    let p = randomInt(1,2)
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
  let goal_add_chance = (1 + player.power/50) * 5
  let pass_add_chance = (1 + player.power/50) * 10
  let event_roll = randomInt(0, 100)
  let success_roll = randomInt(0, 100)
  if (event_roll < event_chance[player.position]) {
    let event = "Goal Attempt"
    if (success_roll < 10 + goal_add_chance) {
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
    if (success_roll < 70 + pass_add_chance) {
      let eventSuccess = true
      let pc = pass_choice[player.position]
      let pc_choice = pass_options[runChance(pc)]
      let possessionPS = possession.players.filter( e => e.position === pc_choice && e.starting === 1 )
      let l = possessionPS.length
      let r = randomInt(0, l)
      let possessionP = possessionPS[r]
      historyElements.push({time: time,  stat:'Pass',  text: "Pass", teamID: possession.id, playerID: possessionP.id, player: possessionP.name})
    } else {
      let eventSuccess = false
      let enemyPS = enemy.players.filter( e => e.position === inverse_positions[player.position] && e.starting === 1 )
      let l = enemyPS.length
      let r = randomInt(0, l)
      let enemyP = enemyPS[r]
      historyElements.push({time: time,  stat:'Steal',  text: "Steal", teamID: enemy.id, playerID: enemyP.id, player: enemyP.name})
    }

  }

  return historyElements


}