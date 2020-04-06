
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

export default function runMatch(handler, home, away, history, time){
  //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
  let teams = [home, away]
  let event_chance = {"F" : 50, "M" : 20, "D" : 10, "G" : 1}
  let pass_choice = {"F": [50, 40, 10], "M": [50, 20, 30], "D": [20, 30, 50], "G": [5, 15, 80]}
  let pass_options = ["F", "M", "D", "G"]
  let inverse_positions = {"F" : "D", "M": "M", "D": "F", "G": "F"}
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
    player = handler.get("Team",possession,"players").filter( e => handler.get("Player",e,"position") === "F" && handler.get("Player",e,"situation")[0] === 1 )[0]
  } else {
    possession = teams.filter(e => handler.get("Team",e,"id") === lastH.teamID)[0]
    enemy = teams.filter(e => handler.get("Team",e,"id") !== lastH.teamID)[0]
    player = handler.get("Team",possession,"players").filter( e => handler.get("Player",e,"id") === lastH.playerID )[0]
  }

  let historyElements = []
  //let historyElement = {time: time,  stat:'N',  text: "Error", teamID: possession.id, playerID: '0', player:'0'}
  let goal_add_chance = (1 + handler.get("Player",player,"strength")/50) * 5
  let pass_add_chance = (1 + handler.get("Player",player,"strength")/50) * 10
  let event_roll = randomInt(0, 100)
  let success_roll = randomInt(0, 100)
  if (event_roll < event_chance[handler.get("Player",player,"position")]) {
    let event = "Goal Attempt"
    if (success_roll < 10 + goal_add_chance) {
      let eventSuccess = true
      historyElements.push({time: time,  stat:'Goal',  text: "Goal", teamID: handler.get("Team",possession,"id"), playerID: handler.get("Player",player,"id"), player: handler.get("Player",player,"name")})
      let ePlayer = handler.get("Team",enemy,"players").filter( e => handler.get("Player",e,"position") === "F" && handler.get("Player",e,"situation")[0] === 1 )[0]
      historyElements.push({time: time,  stat:'Start',  text: "Start", teamID: handler.get("Team",enemy,"id"), playerID: handler.get("Player",ePlayer,"id"), player: handler.get("Player",ePlayer,"name")})
    } else {
      let eventSuccess = false
      let enemyGK = handler.get("Team",enemy,"players").filter( e => handler.get("Player",e,"position") === "G" && handler.get("Player",e,"situation")[0] === 1 )[0]
      historyElements.push({time: time,  stat:'Save',  text: "Save", teamID: handler.get("Team",enemy,"id"), playerID: handler.get("Player",enemyGK,"id"), player: handler.get("Player",enemyGK,"name")})
    }
  } else {
    let event = "Pass Attempt"
    if (success_roll < 70 + pass_add_chance) {
      let eventSuccess = true
      let pc = pass_choice[handler.get("Player",player,"position")]
      let pc_choice = pass_options[runChance(pc)]
      let possessionPS = handler.get("Team",possession,"players").filter( e => handler.get("Player",e,"position") === pc_choice && handler.get("Player",e,"situation")[0] === 1 )
      let l = possessionPS.length
      let r = randomInt(0, l)
      let possessionP = possessionPS[r]
      historyElements.push({time: time,  stat:'Pass',  text: "Pass", teamID: handler.get("Team",possession,"id"), playerID: handler.get("Player",possessionP,"id"), player: handler.get("Player",possessionP,"name")})
    } else {
      let eventSuccess = false
      let enemyPS = handler.get("Team",enemy,"players").filter( e => handler.get("Player",e,"position") === inverse_positions[handler.get("Player",e,"position")] && handler.get("Player",e,"situation")[0] === 1 )
      let l = enemyPS.length
      let r = randomInt(0, l)
      let enemyP = enemyPS[r]
      historyElements.push({time: time,  stat:'Steal',  text: "Steal", teamID: handler.get("Team",enemy,"id"), playerID: handler.get("Player",enemyP,"id"), player: handler.get("Player",enemyP,"name")})
    }

  }

  return historyElements


}