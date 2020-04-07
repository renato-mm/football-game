/*
Get API (section, id, property)

(int* denotes its an id to be used with Get again)

---Human (id = player number)
team = int*

---Team 
(id = 0 -> list of ints*) all teams
name = string
fullName = string
nationality= string
id: int
coach: int*
color1: str  (eg: "#D10119")
color2: /\
strength: int
players: list of ints*
moral: int
finances: ?????????????????????/
(finances: current cash, income (tickets sold, players sold, prizes), expenses (salaries, players bought, stands, interest paid), current interest, amount loaned, ticket cost)
stadium: int*
cash: int

next opponent = int*
league division = int
standing = [vitorias, empates, derrotas, gols pró, gols contra e pontos]

---Player
(id = 0 -> list of ints*) all players
name = string
id = int
position = string
nationality = string
moral = int
situation = list [(int = ["starting"/"benched"/"out"/"injured"/"penalized"]), (int = number of matches)]
strength = int
behaviour = str
contract = list [(int = number of matches), (int = salary), (int = contract break fine)]

---League (id = league division)
teams = list of ints*
*/

export class InfoHandler {
    constructor(info) {
        this.baseInfo = info
        this.sessionInfo = {}
        this.teamsRange = [this.baseInfo["TeamsRange"]["start"], this.baseInfo["TeamsRange"]["end"]]
        this.coachesRange = [this.baseInfo["CoachesRange"]["start"], this.baseInfo["CoachesRange"]["end"]]
        this.playersRange = [this.baseInfo["PlayersRange"]["start"], this.baseInfo["PlayersRange"]["end"]]
        this.teamsPlaying = []
        this.playersPlaying = []
        this.coachesPlaying = []
        this.numberOfPlayers = 1
        this.playersTeam = {}
        this.playersTeam[1] = 1
        this.teamsIn = this.all_teams();
        this.teamsOut = [];
        this.divisions = 4
        this.divisions_size = 4
        this.cup_directs_size = (60/100) * this.divisions_size
        this.cup_directs_phase = 3
        this.cup_prelim_size = 10
        this.divisions_teams = {}
        this.cup_teams = {} 
        this.next_tourn = "League"
        this.season = 2020
        this.seasonGames = {league: [], cup: []}
        this.current_matches = []
    }

    randomInt(l, h) {
        let c = Math.floor(Math.random() * (h - l)) + l
        return c
      }

    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

    inArray(x, a) {
        for (let i = 0 ; i < a.length ; i++) {
            if (a[i] === x) {
                return true
            }
        }
        return false
    }

    initializeNewSessionInfo() {
        for (let x = this.teamsRange[0] ; x <= this.teamsRange[1] ; x++) {
            let pl = this.baseInfo[x]["players"]
            pl.forEach(element => {this.baseInfo[element]["teamID"] = x}) 
            this.baseInfo[this.baseInfo[x]["coach"]]["teamID"] = x
            if (!(this.inArray(x, this.teamsPlaying))) { continue }
            let team = this.baseInfo[x]
            let processed_team = {}
            for (let [key, value] of Object.entries(team)) {
                processed_team[key] = value
            }
            let new_properties = ["moral", "finances", "stadium", "cash"]
            let new_values = [this.randomInt(1, 100), {}, 1, this.randomInt(1, 100000)]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_team[new_properties[l]] = new_values[l]
            } 
            this.sessionInfo[x] = processed_team
        }

        for (let x = this.coachesRange[0] ; x <= this.coachesRange[1] ; x++) {
            if (!(this.inArray(this.baseInfo[x]["teamID"], this.teamsPlaying))) { continue }
            this.coachesPlaying.push(x)
            let coach = this.baseInfo[x]
            let processed_coach = {}
            for (let [key, value] of Object.entries(coach)) {
                processed_coach[key] = value
            }
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract"]
            let new_values = [this.randomInt(1, 100), [1, 0], this.randomInt(1, 50), "FP", [0, this.randomInt(1, 100000), this.randomInt(1, 100000)]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_coach[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_coach["id"]] = processed_coach
            
        }

        for (let x = this.playersRange[0] ; x <= this.playersRange[1] ; x++) {
            if (!(this.inArray(this.baseInfo[x]["teamID"], this.teamsPlaying))) { continue }
            this.playersPlaying.push(x)
            let player = this.baseInfo[x]
            let processed_player = {}
            for (let [key, value] of Object.entries(player)) {
                processed_player[key] = value
            }
            let team_power = (this.baseInfo[this.baseInfo[x]["teamID"]]["strength"] / this.baseInfo[this.teamsPlaying[0]]["strength"]) * 50
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract"]
            let new_values = [this.randomInt(1, 100), [1, 0], this.randomInt(team_power - 5, team_power), "FP", [0, this.randomInt(1, 100000), this.randomInt(1, 100000)]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_player[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_player["id"]] = processed_player
            
        }

        for (let x = 1 ; x <= this.numberOfPlayers ; x++) {
            this.sessionInfo[this.playersTeam[x]]["coach"] = -x
        }

        //console.log("making games")
        this.seasonGamesMaker()
        //console.log("getting next matches")
        this.nextMatches()
    }

    initialization(action, ids) {
        if (action === "Teams In") {
            return this.teamsIn
        } else if (action === "Teams Out") {
            return this.teamsOut
        } else if (action === "Remove") {
            let mover = 0
            for (let x = 0 ; x < this.teamsIn.length ; x++) {
                if (this.teamsIn[x].id === ids[0]) {
                    mover = this.teamsIn[x]
                    this.teamsIn.splice(x, 1)
                }
            }
            this.teamsOut.push(mover)
        } else if (action === "Add") {
            let mover = 0
            for (let x = 0 ; x < this.teamsOut.length ; x++) {
                if (this.teamsOut[x].id === ids[0]) {
                    mover = this.teamsOut[x]
                    this.teamsOut.splice(x, 1)
                }
            }
            this.teamsIn.push(mover)
        } else if (action === "Initialize") {
            this.teamsPlaying = []
            for (let [key, value] of Object.entries(this.teamsIn)) {
                this.teamsPlaying.push(parseInt(value["id"]))
            }
            //console.log(this.teamsPlaying)
            this.teamsPlaying.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})
            let temp = this.teamsPlaying.slice()
            temp.sort((a, b) => {return a["strength"] - b["strength"]})
            //this.cup_teams["Directs"] = temp.slice(0,2)
            //this.cup_teams["Prelim"] = temp.slice(2,13)
            let count = 1
            while (count <= this.divisions) {
                this.divisions_teams[count] = temp.splice(0, this.divisions_size)
                count = count + 1
            }
            this.initializeNewSessionInfo()
        }
    }

    seasonGamesMaker() {
        for (let z = 1 ; z <= this.divisions ; z++) {
            let all_games1 = []
            let all_games2 = []
            //console.log(this.divisions_teams)
            for (let x = 0 ; x < this.divisions_teams[z].length ; x++) {
                for (let y = x + 1 ; y < this.divisions_teams[z].length; y++) {
                    let r = this.randomInt(1, 2)
                    if (r === 1) {
                        all_games1.push([this.divisions_teams[z][x], this.divisions_teams[z][y]])
                        all_games2.push([this.divisions_teams[z][y], this.divisions_teams[z][x]])
                    } else { 
                        all_games2.push([this.divisions_teams[z][x], this.divisions_teams[z][y]])
                        all_games1.push([this.divisions_teams[z][y], this.divisions_teams[z][x]])
                    }
                }
            }
            all_games1 = this.shuffle(all_games1)
            all_games2 = this.shuffle(all_games2)
            let inds = []
            let ag1 = []
            let ag2 = []
            while (inds.length < all_games1.length) {
                let day = []
                for (let i = 0 ; i < all_games1.length ; i++) {
                    let game = all_games1[i]
                    let break_switch = false
                    let add_switch = true
                    //console.log("Testing: ", game)
                    for (let j = 0 ; j < day.length ; j++) {
                        let cgame = day[j]
                        //console.log("games", game, cgame)
                        if (game[0] === cgame[0] || game[1] === cgame[1] || game[0] === cgame[1] || game[1] === cgame[0]) {
                            //console.log("break")
                            break_switch = true
                            break
                        }
                    }
                    //console.log(game)
                    if (break_switch) {
                        continue
                    }
                    for (let p = 0 ; p < inds.length ; p++){
                        if (i === inds[p]) {
                            add_switch = false
                        }
                    }
                    if (add_switch) {
                        //console.log("day adding game: ", game)
                        day.push(game)
                        inds.push(i)
                    }
                }
                //console.log("day", day)
                ag1.push(day)
            }
            inds = []
            //console.log("Making shit", inds, all_games2)
            while (inds.length < all_games2.length) {
                let day = []
                for (let i = 0 ; i < all_games2.length ; i++) {
                    let game = all_games2[i]
                    let break_switch = false
                    let add_switch = true
                    //console.log("Testing: ", game)
                    for (let j = 0 ; j < day.length ; j++) {
                        let cgame = day[j]
                        //console.log("games", game, cgame)
                        if (game[0] === cgame[0] || game[1] === cgame[1] || game[0] === cgame[1] || game[1] === cgame[0]) {
                            //console.log("break")
                            break_switch = true
                            break
                        }
                    }
                    //console.log(game)
                    if (break_switch) {
                        continue
                    }
                    for (let p = 0 ; p < inds.length ; p++){
                        if (i === inds[p]) {
                            add_switch = false
                        }
                    }
                    if (add_switch) {
                        //console.log("day adding game: ", game)
                        day.push(game)
                        inds.push(i)
                    }
                }
                //console.log("day", day)
                ag2.push(day)
            }
            //console.log(ag2)
            this.seasonGames["league"][z] = [ag1, ag2]
        }
        this.divisionGameN = [0, 0]
    }

    nextMatches() {
        //console.log("getting next matches")
        if (this.next_tourn === "League") {
            this.currentMatchesHistory = []
            this.current_matches = []
            for (let x = 1 ; x <= this.divisions ; x++){
                //console.log(this.seasonGames)
                let divx = this.seasonGames["league"][x][this.divisionGameN[0]][this.divisionGameN[1]]
                //console.log(this.seasonGames)
                //console.log("divx", divx)
                this.current_matches = this.current_matches.concat(divx)
            }
            //console.log("all matches", this.current_matches)
            for (let y = 0 ; y < this.current_matches.length ; y++) {
                this.currentMatchesHistory.push([{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}])
            }
            this.divisionGameN[1] += 1
            if (this.divisionGameN[1] >= this.divisions_size/2) {
                if (this.divisionGameN[0] === 1) {
                    this.divisionGameN -= 1
                    this.current_matches = []
                } else if (this.divisionGameN[0] === 0) {
                    this.divisionGameN[0] = 1
                    this.divisionGameN = 0
                }
            }
        }
        return this.current_matches
    }

    all_teams(ids) {
        let returnArray = [];
        for (let x = 1 ; x <= 10000 ; x++) {
            if (this.baseInfo[x]) {
                returnArray.push(this.baseInfo[x])
            }
        }
        return returnArray;
    }

    get(section, id, property) {
        if (property === undefined || id === undefined || property === undefined) {
            console.log("something went wrong and is undefined", section, id, property)
        }

        if (section === "Team") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else if (id === 0) {
                return this.teamsPlaying
            } else if (property === "next opponent") {
                for (let x = 0 ; x < this.current_matches.length ; x++) {
                    let match = this.current_matches[x]
                    if (id in match) {
                        if (match[0] === 1) {
                            return match[1]
                        } else {
                            return match[0]
                        }
                    }
                }
            } else if (property === "league division") {
                for (let x = 1 ; x <= this.divisions ; x++) {
                    if (id in this.divisions_teams[x]) {
                        return x
                    }
                }
            } else {
                return this.sessionInfo[id][property]
            }
        }
        if (section === "Player") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else if (id === 0) {
                return this.playersPlaying
            } else {
                return this.sessionInfo[id][property]
            }
        }
        
        if (section === "Match") {
            if (property === "home") {
                //console.log("matches", this.current_matches)
                //console.log("id : ", id)
                return this.current_matches[id][0]
            } else if (property === "away") {
                return this.current_matches[id][1]
            } else if (property === "history") {
                //console.log(this.currentMatchesHistory[id])
                return this.currentMatchesHistory[id]
            } else if (property === "current matches") {
                return this.current_matches
            }
        }

        if (section === "League") {
            if (property === "teams") {
                return this.divisions_teams[id]
            } 
        }
        if (section === "Cup") {

        }

        if (section === "Human") {
            if (property === "team") {
                return this.playersTeam[id]
            }
        }

        console.log([section, id, property, "Get didnt return"])
    }

    set(section, id, property, value) {
        if (section === "Team") {
            if (property === "all") {
                this.sessionInfo[id] = value
            } else {
                this.sessionInfo[id][property] = value
            }
        }
        if (section === "Player") {
            if (property === "all") {
                this.sessionInfo[id] = value
            } else {
                this.sessionInfo[id][property] = value
            }
        }
        if (section === "League") {
        }
        if (section === "Cup") {
        }
        if (section === "Human") {
        }
    }

    runChance(chances) {
        if (typeof(chances) === typeof([])) {
          let chances_sum = chances.slice()
          let total = chances_sum.reduce((a, b) => a + b, 0)
          let c = this.randomInt(0, total)
          let i
          let sc = 0
          for (i = 0; i < chances.length; i++) {
            sc += chances[i]
            if (c < sc) {
              return i
            }
          }
        } else if (typeof(chances) === typeof(50)) {
          let c = this.randomInt(0, chances)
          if (c < chances) {
            return true
          } else {
            return false
          }
        }
      }

    runMatches(time) {
        for (let x = 0 ; x < this.current_matches.length ; x++) {
            this.runMatch(x, time)
        }
    }
      
    runMatch(matchID, time){
        //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
        //console.log("running match", matchID)
        let history = this.currentMatchesHistory[matchID] 
        let teams = this.current_matches[matchID] //[home, away]
        let event_chance = {"F" : 50, "M" : 20, "D" : 10, "G" : 1}
        let pass_choice = {"F": [50, 40, 10], "M": [50, 20, 30], "D": [20, 30, 50], "G": [5, 15, 80]}
        let pass_options = ["F", "M", "D", "G"]
        let inverse_positions = {"F" : "D", "M": "M", "D": "F", "G": "F"}
        let player
        let possession
        let enemy
        let lastH = history[history.length - 1]

        if (lastH.text === "Match Start"){
            let p = this.randomInt(1,2)
            possession = teams[p]
            let e = 0
            if (p === 1) {
            e = 0
            } else {
            e = 1
            }
            enemy = teams[e] 
            player = this.get("Team",possession,"players").filter( e => this.get("Player",e,"position") === "F" && this.get("Player",e,"situation")[0] === 1 )[0]
        } else {
            possession = teams.filter(e => this.get("Team",e,"id") === lastH.teamID)[0]
            enemy = teams.filter(e => this.get("Team",e,"id") !== lastH.teamID)[0]
            player = this.get("Team",possession,"players").filter( e => this.get("Player",e,"id") === lastH.playerID )[0]
        }

        //console.log(history)
        
        let historyElements = []
        //let historyElement = {time: time,  stat:'N',  text: "Error", teamID: possession.id, playerID: '0', player:'0'}
        let goal_add_chance = (1 + this.get("Player",player,"strength")/50) * 5
        let pass_add_chance = (1 + this.get("Player",player,"strength")/50) * 10
        let event_roll = this.randomInt(0, 100)
        let success_roll = this.randomInt(0, 100)
        if (event_roll < event_chance[this.get("Player",player,"position")]) {
            let event = "Goal Attempt"
            if (success_roll < 10 + goal_add_chance) {
            let eventSuccess = true
            historyElements.push({time: time,  stat:'Goal',  text: "Goal", teamID: this.get("Team",possession,"id"), playerID: this.get("Player",player,"id"), player: this.get("Player",player,"name")})
            let ePlayer = this.get("Team",enemy,"players").filter( e => this.get("Player",e,"position") === "F" && this.get("Player",e,"situation")[0] === 1 )[0]
            historyElements.push({time: time,  stat:'Start',  text: "Start", teamID: this.get("Team",enemy,"id"), playerID: this.get("Player",ePlayer,"id"), player: this.get("Player",ePlayer,"name")})
            } else {
            let eventSuccess = false
            let enemyGK = this.get("Team",enemy,"players").filter( e => this.get("Player",e,"position") === "G" && this.get("Player",e,"situation")[0] === 1 )[0]
            historyElements.push({time: time,  stat:'Save',  text: "Save", teamID: this.get("Team",enemy,"id"), playerID: this.get("Player",enemyGK,"id"), player: this.get("Player",enemyGK,"name")})
            }
        } else {
            let event = "Pass Attempt"
            if (success_roll < 70 + pass_add_chance) {
            let eventSuccess = true
            let pc = pass_choice[this.get("Player",player,"position")]
            let pc_choice = pass_options[this.runChance(pc)]
            let possessionPS = this.get("Team",possession,"players").filter( e => this.get("Player",e,"position") === pc_choice && this.get("Player",e,"situation")[0] === 1 )
            let l = possessionPS.length
            let r = this.randomInt(0, l)
            let possessionP = possessionPS[r]
            historyElements.push({time: time,  stat:'Pass',  text: "Pass", teamID: this.get("Team",possession,"id"), playerID: this.get("Player",possessionP,"id"), player: this.get("Player",possessionP,"name")})
            } else {
            let eventSuccess = false
            let enemyPS = this.get("Team",enemy,"players").filter( e => this.get("Player",e,"position") === inverse_positions[this.get("Player",e,"position")] && this.get("Player",e,"situation")[0] === 1 )
            let l = enemyPS.length
            let r = this.randomInt(0, l)
            let enemyP = enemyPS[r]
            historyElements.push({time: time,  stat:'Steal',  text: "Steal", teamID: this.get("Team",enemy,"id"), playerID: this.get("Player",enemyP,"id"), player: this.get("Player",enemyP,"name")})
            }
        
        }
        
        //console.log("histroyelementst", historyElements)
        for (let z = 0 ; z< historyElements.length ; z++) {
            this.currentMatchesHistory[matchID].push(historyElements[z])
        }
        //console.log(this.currentMatchesHistory[matchID])
        }
}