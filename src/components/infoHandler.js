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

standing = list of ints [0 = matches played, 1 = victories, 2 = draw, 3 = defeats, 4 = goals made, 5 = goals taken, 6 = points, 7 = division]
history = list of lists  
    [[0 = home team id, 1 = away team id, 2 = home score, 3 = away score, 4 = winner id (0 if draw), 5 = tournament name, 6 = phase/division, 7 = season, 8 = match played bool ], [], [] ...]
calendar = list of lists  
    [[0 = home team id, 1 = away team id, 2 = home score, 3 = away score, 4 = winner id (0 if draw), 5 = tournament name, 6 = phase/division, 7 = season, 8 = match played bool ], [], [] ...]
next opponent = list [opponent id = int, Home/Away = string]
league division = int

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
history = list of ints [0 = matches, 1 = goals, 2 = yellows, 3 = reds, 4 = injuries]
season history = list of ints [0 = matches, 1 = goals, 2 = yellows, 3 = reds, 4 = injuries]

---League (id = league division)
teams = list of ints*

---Season
day = [tournament name = string, tournament round = int]
*/

export class InfoHandler {
    constructor(info) {
        this.baseInfo = info
        //this.baseInfo[10000] = {name: "Empty Team", id: 10000, fullName: "Omega Empty Team", nationality: "NOWHERE", coach: -1000, color1: "#000000", color2: "#FFFFFF", strength: 10000, players: []}
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
        this.promotionSpots = 1
        this.cup_directs_size = (60/100) * this.divisions_size
        this.cup_directs_phase = 3
        this.cup_prelim_size = 10
        this.divisionsTeams = {}
        this.cupTeams = {} 
        //this.next_tourn = "League"
        this.season = 2020
        this.seasonGames = {League: [], Cup: []}
        this.currentMatches = []
        this.extremesStrengths = [50, 1]
        this.currentDayState = 0
        this.startingSeason = 2020
        this.currentSeason = this.startingSeason
        this.seasonDay = 0
        this.leagueStandings = {}
        this.pastSeasons = {}
    }

    randomInt(l, h) {
        let c = Math.floor((Math.random() * (h - l + 1))) + l
        //console.log(l, h, c)
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

    all_teams(ids) {
        let returnArray = [];
        for (let x = this.teamsRange[0] ; x <= this.teamsRange[1] ; x++) {
            let team = this.baseInfo[x]
            team["strength"] = team["originalStrength"]
            if (this.baseInfo[x]) {
                returnArray.push(x)
            }
        }
        return returnArray;
    }

    initializeNewSessionInfo() {
        for (let x = this.teamsRange[0] ; x <= this.teamsRange[1] ; x++) {
            let pl = this.baseInfo[x]["players"]
            let coach = this.baseInfo[x]["coach"]
            pl.forEach(element => {this.baseInfo[element]["teamID"] = x}) 
            this.baseInfo[coach]["teamID"] = x
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
            console.log(processed_coach)
            
        }

        for (let x = this.playersRange[0] ; x <= this.playersRange[1] ; x++) {
            if (!(this.inArray(this.baseInfo[x]["teamID"], this.teamsPlaying))) { continue }
            this.playersPlaying.push(x)
            let player = this.baseInfo[x]
            let processed_player = {}
            for (let [key, value] of Object.entries(player)) {
                processed_player[key] = value
            }
            let thisPower = this.baseInfo[this.baseInfo[x]["teamID"]]["strength"]
            let highestPower = this.extremesStrengths[0]
            let lowestPower = this.extremesStrengths[1]
            let team_power = Math.floor(((thisPower - lowestPower) / (highestPower - lowestPower)) * 50)
            if (team_power <= 0) {
                team_power = 1
            } 
            let lowEnd = team_power - 5
            if (lowEnd <= 0) {
                lowEnd = 1
            }
            let playerPower = this.randomInt(lowEnd, team_power)
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract", "history", "season history"]
            let new_values = [this.randomInt(1, 100), [0, 0], playerPower, "FP", [0, playerPower * 500, playerPower * 10000], [0, 0, 0, 0], [0, 0, 0, 0]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_player[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_player["id"]] = processed_player
        }

        for (let x = 1 ; x <= this.numberOfPlayers ; x++) {
            this.sessionInfo[this.playersTeam[x]]["coach"] = -x
        }

        this.normalizeHumanTeamPower()

        for (let x = 0 ; x < this.teamsPlaying.length ; x++) {
            this.formationSetter(this.teamsPlaying[x], [4, 3, 3])
        }
    }

    formationSetter(teamID, formation) {
        let teamPlayers = this.sessionInfo[teamID]["players"]
        for (let x = 0 ; x < teamPlayers.length ; x++) {
            this.sessionInfo[teamPlayers[x]]["situation"][0] = 0
        }
        let goalkeepers = teamPlayers.filter(e => this.sessionInfo[e]["position"] === "G").sort((a, b) => {return this.sessionInfo[b]["strength"] - this.sessionInfo[a]["strength"]})
        let defenders = teamPlayers.filter(e => this.sessionInfo[e]["position"] === "D").sort((a, b) => {return this.sessionInfo[b]["strength"] - this.sessionInfo[a]["strength"]})
        let mids = teamPlayers.filter(e => this.sessionInfo[e]["position"] === "M").sort((a, b) => {return this.sessionInfo[b]["strength"] - this.sessionInfo[a]["strength"]})
        let forwards = teamPlayers.filter(e => this.sessionInfo[e]["position"] === "F").sort((a, b) => {return this.sessionInfo[b]["strength"] - this.sessionInfo[a]["strength"]})
        let formationPlayers = [goalkeepers[0]]
        let rotation = [defenders, mids, forwards]
        if (!(formation.length === 3 && (formation[0] + formation[1] + formation[2] === 10))) {
            formation = [4, 3, 3]
        }
        for (let p = 0 ; p < 3 ; p++) {
            let ps = rotation[p].splice(0, formation[p])
            //console.log(ps)
            formationPlayers = formationPlayers.concat(ps)
        }
        for (let y = 0 ; y < formationPlayers.length ; y++) {
            //console.log(formationPlayers)
            this.sessionInfo[formationPlayers[y]]["situation"][0] = 1
        }
    }

    initialization(action, ids) {
        if (action === "Teams In") {
            return this.teamsIn
        } else if (action === "Teams Out") {
            return this.teamsOut
        } else if (action === "Get") {
            return [this.baseInfo[ids]["color1"], this.baseInfo[ids]["color2"], this.baseInfo[ids]["name"]]
        } else if (action === "Remove") {
            let mover = 0
            for (let x = 0 ; x < this.teamsIn.length ; x++) {
                if (this.teamsIn[x] === ids[0]) {
                    mover = this.teamsIn[x]
                    this.teamsIn.splice(x, 1)
                }
            }
            this.teamsOut.push(mover)
        } else if (action === "Add") {
            let mover = 0
            for (let x = 0 ; x < this.teamsOut.length ; x++) {
                if (this.teamsOut[x] === ids[0]) {
                    mover = this.teamsOut[x]
                    this.teamsOut.splice(x, 1)
                }
            }
            this.teamsIn.push(mover)
        } else if (action === "Player") {
            this.playersTeam[1] = ids[0]
        } else if (action === "Get Player") {
            return this.playersTeam[ids[0]]
        } else if (action === "Initialize") {
            this.teamsPlaying = this.teamsIn.slice()
            //console.log(this.teamsPlaying)
            this.teamsPlaying.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})
            let temp = this.teamsPlaying.slice()
            temp.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})
            //console.log(temp)
            for (let x = 0 ; x < temp.length ; x++) {
                if (temp[x] === this.playersTeam[1]) {
                    temp.splice(x, 1)
                }
            }
            let hP = this.baseInfo[temp[0]]["originalStrength"]
            let lP = this.baseInfo[temp[temp.length - 1]]["originalStrength"]
            this.extremesStrengths = [hP, lP]
            //this.cupTeams["Directs"] = temp.slice(0,2)
            //this.cupTeams["Prelim"] = temp.slice(2,13)
            let count = 1
            while (count <= this.divisions) {
                if (count === this.divisions) {
                    this.divisionsTeams[count] = temp.splice(0, this.divisions_size - 1)
                    this.divisionsTeams[count].push(this.playersTeam[1])
                } else { 
                    this.divisionsTeams[count] = temp.splice(0, this.divisions_size)
                }
                count = count + 1
            }
            this.initializeNewSessionInfo()
            this.runSeason("Start")
        }
    }

    normalizeHumanTeamPower() {
        let avgPower = [0, 0]
        for (let x = 0 ; x < this.divisionsTeams[this.divisions].length ; x++) {
            let team = this.divisionsTeams[this.divisions][x]
            if (this.playersTeam[1] === team) {continue}
            let players = this.sessionInfo[team]["players"]
            for (let p = 0 ; p < players.length ; p++) {
                let playerStrength = this.sessionInfo[players[p]]["strength"]
                avgPower[0] += playerStrength
                avgPower[1] += 1
            }
        }
        avgPower = Math.floor(avgPower[0] / avgPower[1])
        let humanPlayers = this.sessionInfo[this.playersTeam[1]]["players"]
        for (let t = 0 ; t < humanPlayers.length ; t++) {
            this.sessionInfo[humanPlayers[t]]["strength"] = this.randomInt(avgPower - 2, avgPower + 3)
        }
    }

    seasonGamesMaker() {
        let games = {league: []}
        for (let z = 1 ; z <= this.divisions ; z++) {
            let teams = this.divisionsTeams[z].slice()
            let days = []
            let days2 = []
            //[game[0], game[1], 0, 0, 0, "League", z, this.currentSeason, false]
            for (let x = 0 ; x < this.divisions_size - 1 ; x++) {
                teams = this.shuffle(teams)
                let day = []
                let day2 = []
                for (let y = 0 ; y < this.divisions_size/2 ; y++) {
                    day.push([teams[y * 2], teams[(y * 2) + 1], 0, 0, 0, "League", z, this.currentSeason, false])
                    day2.push([teams[(y * 2) + 1], teams[y * 2], 0, 0, 0, "League", z, this.currentSeason, false])
                }
                days.push(day)
                days2.push(day2)
            }
            games["league"][z] = days.concat(days2)
        } // league games finished

        this.seasonGames["League"] = []
        for (let day = 0 ; day < games["league"][1].length ; day++) {
            let dayGames = []
            for (let div = 1 ; div <= this.divisions ; div++) {
                for (let m = 0 ; m < games["league"][div][day].length ; m ++) {
                    dayGames.push(games["league"][div][day][m])
                }
            }
            this.seasonGames["League"].push(dayGames)
        }

        this.leagueStandings = {}
        for (let div = 1 ; div <= this.divisions ; div++) {
            for (let t = 0 ; t < this.divisionsTeams[div].length ; t++) {
                let teamID = this.divisionsTeams[div][t]
                this.leagueStandings[teamID] = [0, 0, 0, 0, 0, 0, 0, div]
            }
        }
        //console.log(this.leagueStandings)

        for (let x = 0 ; x < this.playersPlaying.length ; x++) {
            let playerID = this.playersPlaying[x]
            this.sessionInfo[playerID]["season history"] = [0, 0, 0, 0]
        }

        this.seasonCalendar = []
        for (let x = 0 ; x < this.seasonGames["League"].length ; x++){
            this.seasonCalendar.push(["League", x])
        }
        this.seasonDay = 0
        //console.log(this.seasonCalendar)
        //console.log(this.seasonGames["league"][1])

    }

    nextMatches() {
        //console.log("getting next matches")
        //console.log(this.currentSeason, this.seasonGames)
        let day = this.seasonCalendar[this.seasonDay]
        this.currentMatchesHistory = []
        this.currentMatchesReturnHistory = []
        this.currentMatches = this.seasonGames[day[0]][day[1]]
        /*
        if (day === "league") {
            for (let div = 1 ; div < this.divisions ; div++) {
                this.currentMatches.push(this.seasonGames["league"][div][day[1]])
            }
        }*/
        for (let y = 0 ; y < this.currentMatches.length ; y++) {
            this.currentMatchesHistory.push([{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}])
            this.currentMatchesReturnHistory.push([{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}])
        }
        //return this.currentMatches
    }

    runSeason(action) {
        if (action === "Start") {
            this.pastSeasons[this.currentSeason - 1] = {standings: this.leagueStandings, games: this.seasonGames, calendar: this.seasonCalendar}
            //console.log("making games")
            this.seasonGamesMaker()
            //console.log("getting next matches")
            this.nextMatches()
        } else if (action === "End day") {
            for (let x = 0 ; x < this.currentMatches.length ; x++) {
                let match = this.currentMatches[x]
                match[match.length - 1] = true;
                (match[2] > match[3]) ? match[4] = match[0] : match[4] = match[1]
                // standing = [0 = matches played, 1 = victories, 2 = draw, 3 = defeats, 4 = goals made, 5 = goals taken, 6 = points, 7 = division]
                let home = match[0]
                let away = match[1]
                let winner = match[4]
                this.leagueStandings[home][0] += 1
                this.leagueStandings[away][0] += 1
                this.leagueStandings[home][4] += match[2]
                this.leagueStandings[away][4] += match[3]
                this.leagueStandings[home][5] += match[3]
                this.leagueStandings[away][5] += match[2]
                if (home === winner) { 
                    this.leagueStandings[home][1] += 1
                    this.leagueStandings[away][3] += 1
                } else if (away === winner) { 
                    this.leagueStandings[away][1] += 1
                    this.leagueStandings[home][3] += 1
                } else {
                    this.leagueStandings[away][2] += 1
                    this.leagueStandings[home][2] += 1
                }
            }
            this.seasonDay += 1
            console.log(this.seasonDay)
            if (this.seasonDay >= this.seasonCalendar.length) {
                this.currentSeason += 1
                this.runSeason("Start")
            } else {
                this.nextMatches()
            }
            
        }
    }

    searchTeamMatches(id, season = "all") {
        let mH = []
        if (season === "all") {
            for (let s = this.startingSeason ; s < this.currentSeason ; s++) {
                let season = this.pastSeasons[s]
                if (season === null || season === undefined) {
                    continue
                } else {
                    for (let d = 0 ; d < season.calendar.length ; d++) {
                        let day = season.calendar[d]
                        let dayMatches = season.games[day[0]][day[1]]
                        for (let m = 0 ; m < dayMatches.length ; m++) {
                            let match = dayMatches[m]
                            if (match[0] === id || match[1] === id) {
                                mH.push(match)
                            }
                        }
                    }
                }
            }
        }
        for (let d = 0 ; d < this.seasonCalendar.length ; d++) {
            let day = this.seasonCalendar[d]
            let dayMatches = this.seasonGames[day[0]][day[1]]
            for (let m = 0 ; m < dayMatches.length ; m++) {
                let match = dayMatches[m]
                if (match[0] === id || match[1] === id) {
                    mH.push(match)
                }
            }
        }
        return mH
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
                for (let x = 0 ; x < this.currentMatches.length ; x++) {
                    let match = this.currentMatches[x]
                    if (match.slice(0, 2).includes(id)) { return (match[0] === id) ? [match[1], "Away"] : [match[0], "Home"] }
                }
                return 10000
            } else if (property === "league division") {
                for (let x = 1 ; x <= this.divisions ; x++) {
                    if (this.divisionsTeams[x].includes(id)) {
                        return x
                    }
                }
            } else if (property === "standing") {
                return this.leagueStandings[id]
            } else if (property === "calendar") {
                return this.searchTeamMatches(id, "current season")
            } else if (property === "history") {
                return this.searchTeamMatches(id)
            } else {
                if (this.sessionInfo[id] !== undefined) { 
                    return this.sessionInfo[id][property] 
                } else {
                    let emptyTeam = {name: "Empty Team", id: null, fullName: "Omega Empty Team", nationality: "NOWHERE", coach: null, color1: "#FF00FF", color2: "#FFFFFF", strength: 10000, players: [null, null, null, null, null, null, null]}
                    return emptyTeam[property]
                }
            }
        }
        if (section === "Player") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else if (id === 0) {
                return this.playersPlaying
            } else {
                if (this.sessionInfo[id] !== undefined) { 
                    return this.sessionInfo[id][property] 
                } else {
                    //["moral", "situation", "strength", "behaviour", "contract"]
                    let emptyPlayer = {name: "Empty Player N" + this.randomInt(1,100), id: null, nationality: "NOWHERE", strength: 1, position: "F", moral: 1, situation: [1, 0], behaviour: "FP", contract: [this.randomInt(1,1000), this.randomInt(1,1000), this.randomInt(1,1000)]}
                    return emptyPlayer[property]
                }
            }
        }
        
        if (section === "Match") {
            if (property === "home") {
                //console.log("matches", this.currentMatches)
                //console.log("id : ", id)
                return this.currentMatches[id][0]
            } else if (property === "away") {
                return this.currentMatches[id][1]
            } else if (property === "history") {
                //console.log(this.currentMatchesHistory[id])
                //return this.currentMatchesReturnHistory[id]
                return [this.currentMatchesReturnHistory[id], this.currentMatches[id][2], this.currentMatches[id][3]]
            } else if (property === "current matches") {
                return this.currentMatches
            } else if (property === "tournament") {
                return this.seasonCalendar[this.seasonDay][0]
            }
        }

        if (section === "League") {
            if (property === "teams") {
                return this.divisionsTeams[id]
            } else if (property === "division sizes") {
                return [this.divisions, this.divisions_size/2]
            } else if (property === "round") {
                let day = this.seasonCalendar[this.seasonDay]
                if (day[0] === "league") { return this.seasonCalendar[this.seasonDay][1] + 1 }
            }
        }
        if (section === "Cup") {

        }

        if (section === "Season") {
            if (property === "year") {
                return this.currentSeason
            } else if (property === "day") {
                let day = this.seasonCalendar[this.seasonDay]
                return [day[0], day[1] + 1]
            }
        }

        if (section === "Human") {
            if (property === "team") {
                return this.playersTeam[id]
            } else if (property === "current") {
                return 1
            } else if (property === "team colors") {
                return [this.sessionInfo[this.playersTeam[id]]["color1"], this.sessionInfo[this.playersTeam[id]]["color2"]]
            }
        }

        console.log([section, id, property, "Get didnt return"])
    }

    set(section, id, property, value) {
        if (section === "Team") {
            if (property === "all") {
                this.sessionInfo[id] = value
            } else if (property === "formation") {
                this.formationSetter(id, value)
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
          let sc = 0
          for (let i = 0; i < chances.length; i++) {
            sc += chances[i]
            if (c <= sc) {
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
        if (time >= 1 && this.currentDayState < 2) {
            this.currentDayState = 1
            for (let x = 0 ; x < this.currentMatches.length ; x++) {
                this.runMatch(x, time)
            }
        } else if (time === -1) {
            this.currentDayState = 2
        } else if (time === -2) {
            this.currentDayState = 0
            this.runSeason("End day")
        }
    }
      
    runMatch(matchID, time){
        //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
        //console.log("running match", matchID)
        let history = this.currentMatchesHistory[matchID] 
        let cMatch = this.currentMatches[matchID]
        //console.log(cMatch)
        let teams = cMatch.slice(0, 2) //[home, away]
        //console.log(teams)
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
            possession = teams[p - 1]
            enemy = teams[(p-1 === 0) ? 1 : 0] 
            player = this.sessionInfo[possession]["players"].filter( e => this.sessionInfo[e]["position"] === "F" && this.sessionInfo[e]["situation"][0] === 1 )[0]
        } else {
            possession = teams.filter(e => e === lastH.teamID)[0]
            enemy = teams.filter(e => e !== lastH.teamID)[0]
            player = this.sessionInfo[possession]["players"].filter( e => this.sessionInfo[e]["id"] === lastH.playerID )[0]
        }

        //console.log(history)
        let historyElements = []
        let returnHistoryElements = []
        //let historyElement = {time: time,  stat:'N',  text: "Error", teamID: possession.id, playerID: '0', player:'0'}

        let event_roll = this.randomInt(0, 100)
        let success_roll = this.randomInt(0, 100)

        if (event_roll < event_chance[this.sessionInfo[player]["position"]]) {
            let enemyGK = this.sessionInfo[enemy]["players"].filter( e => this.sessionInfo[e]["position"] === "G" && this.sessionInfo[e]["situation"][0] === 1 )[0]
            let ePlayerStart = this.sessionInfo[enemy]["players"].filter( e => this.sessionInfo[e]["position"] === "F" && this.sessionInfo[e]["situation"][0] === 1 )[0]

            let strengthDiff = (this.sessionInfo[player]["strength"] - this.sessionInfo[enemyGK]["strength"])
            if (strengthDiff < 0) {strengthDiff = 0}
            let goal_add_chance = (1 + strengthDiff/50) * 5

            if (success_roll < 10 + goal_add_chance) {
                historyElements.push({time: time,  stat:'Goal',  text: "Goal", teamID: possession, playerID: player, player: this.sessionInfo[player]["name"]})
                returnHistoryElements.push({time: time,  stat:'Goal',  text: "Goal", teamID: possession, playerID: player, player: this.sessionInfo[player]["name"]})
                this.sessionInfo[player]["history"][0] += 1
                this.sessionInfo[player]["season history"][0] += 1
                //this.currentMatchesReturnHistory[matchID][(possession === teams[0]) ? 1 : 2] += 1
                this.currentMatches[matchID][(possession === teams[0]) ? 2 : 3] += 1
                historyElements.push({time: time,  stat:'Start',  text: "Start", teamID: enemy, playerID: ePlayerStart, player: this.sessionInfo[ePlayerStart]["name"]})
            } else {
                historyElements.push({time: time,  stat:'Save',  text: "Save", teamID: enemy, playerID: enemyGK, player: this.sessionInfo[enemyGK]["name"]})
            }
        } else {
            let pc = pass_choice[this.get("Player",player,"position")]
            let pc_choice = pass_options[this.runChance(pc)]
            let possessionPS = this.sessionInfo[possession]["players"].filter( e => this.sessionInfo[e]["position"] === pc_choice && this.sessionInfo[e]["situation"][0] === 1 )
            let rp = this.randomInt(0, possessionPS.length - 1)
            let possessionP = possessionPS[rp]

            let enemyPS = this.sessionInfo[enemy]["players"].filter( e => this.sessionInfo[e]["position"] === inverse_positions[this.sessionInfo[e]["position"]] && this.sessionInfo[e]["situation"][0] === 1 )
            let re = this.randomInt(0, enemyPS.length - 1)
            let enemyP = enemyPS[re]

            let strengthDiff = (this.sessionInfo[player]["strength"] - this.sessionInfo[enemyP]["strength"])
            if (strengthDiff < 0) {strengthDiff = 0}
            let pass_add_chance = (1 + this.sessionInfo[player]["strength"]/50) * 10

            if (success_roll < 70 + pass_add_chance) {
                historyElements.push({time: time,  stat:'Pass',  text: "Pass", teamID: possession, playerID: possessionP, player: this.sessionInfo[possessionP]["name"]})
            } else {
                historyElements.push({time: time,  stat:'Steal',  text: "Steal", teamID: enemy, playerID: enemyP, player: this.sessionInfo[enemyP]["name"]})
            }
        
        }
        
        for (let z = 0 ; z< historyElements.length ; z++) {
            this.currentMatchesHistory[matchID].push(historyElements[z])
        }
        for (let z = 0 ; z< returnHistoryElements.length ; z++) {
            this.currentMatchesReturnHistory[matchID].push(returnHistoryElements[z])
        }
    }
}