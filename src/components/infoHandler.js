/*
Get API

(int* denotes its an id to be used with Get again)

---Human (id = player number)
team = int*

---Team
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
stadium: int*
cash: int

---Player
name = string
id = int
position = string
nationality = string
moral = int
situation = list [(str = "starting"/"benched"/"out"/"injured"/"penalized"), (int = number of matches)]
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
        this.initializeNewSessionInfo()
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
    }

    randomInt(l, h) {
        let c = Math.floor(Math.random() * (h - l)) + l
        return c
      }

    initializeNewSessionInfo() {
        for (let x = this.teamsRange[0] ; x <= this.teamsRange[1] ; x++) {
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
            this.sessionInfo[processed_team["id"]] = processed_team
        }

        for (let x = this.coachesRange[0] ; x <= this.coachesRange[1] ; x++) {
            let coach = this.baseInfo[x]
            let processed_coach = {}
            for (let [key, value] of Object.entries(coach)) {
                processed_coach[key] = value
            }
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract"]
            let new_values = [this.randomInt(1, 100), [0, 0], this.randomInt(1, 50), "FP", [0, this.randomInt(1, 100000), this.randomInt(1, 100000)]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_coach[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_coach["id"]] = processed_coach
            
        }

        for (let x = this.playersRange[0] ; x <= this.playersRange[1] ; x++) {
            let player = this.baseInfo[x]
            let processed_player = {}
            for (let [key, value] of Object.entries(player)) {
                processed_player[key] = value
            }
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract"]
            let new_values = [this.randomInt(1, 100), [0, 0], this.randomInt(1, 50), "FP", [0, this.randomInt(1, 100000), this.randomInt(1, 100000)]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_player[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_player["id"]] = processed_player
            
        }

        for (let x = 1 ; x <= this.numberOfPlayers ; x++) {
            this.sessionInfo[this.playersTeam[x]].coach = -x
        }
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
            let temp = this.teamsIn.slice()
            temp.sort((a, b) => {return a["strength"] - b["strength"]})
            this.cup_teams["Directs"] = temp.slice(0,2)
            this.cup_teams["Prelim"] = temp.slice(2,13)
            let count = 1
            while (count < this.divisions) {
                count = count + 1
                this.divisions_teams[1] = temp.splice(0, this.divisions_size)
            }
        }
    }

    nextMatches() {
        let matches = []
        let inds = []
        if (this.next_tourn === "League") {
            for (let x = 1 ; x < this.divisions ; x++) {
                for (let y = 1 ; y < this.divisions_size/2 ; y++) {
                    matches.push([this.divisions_teams[1][y], this.divisions_teams[1][y+this.divisions_size/2]])
                    matches.push([this.divisions_teams[2][y], this.divisions_teams[2][y+this.divisions_size/2]])
                    matches.push([this.divisions_teams[3][y], this.divisions_teams[3][y+this.divisions_size/2]])
                    matches.push([this.divisions_teams[4][y], this.divisions_teams[4][y+this.divisions_size/2]])
                }
            }
        }
        return matches
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
        if (section === "Team") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else {
                return this.sessionInfo[id][property]
            }
        }
        if (section === "Player") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else {
                return this.sessionInfo[id][property]
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
    }
}