/*
Get API (section, id, property, extras = [])
Set API (section, id, property, value, extras = [])

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
    [[0 = home team id, 1 = away team id, 2 = home score, 3 = away score, 4 = winner id (0 if draw), 5 = tournament name, 6 = phase/division, 7 = round, 8 = season, 9 = match played bool ], [], [] ...]
calendar = list of lists  
    [[0 = home team id, 1 = away team id, 2 = home score, 3 = away score, 4 = winner id (0 if draw), 5 = tournament name, 6 = phase/division, 7 = round, 8 = season, 9 = match played bool ], [], [] ...]
next opponent = list [opponent id = int, Home/Away = string]
league division = int
is human = bool
current matches id = int index of the current match of the team
purchase check = returns list [bool = purchase success, string = info about purchase(e.g. "Too expensive")]  ***extras[0] = player id to be purchased

SET
formation value = [defense = int, midfield = int, forward = int]
purchase = input player id to be purchased by the team

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
teamID = int*

---Match (id = index of the match)
home = int
away = int
history = [list of history elements of interest, home score = int, away score = int]
current matches = list of matches
tournament = string (name of the tournament, "League" or "Cup")
sub = int (number of substitutions made by the team thats the given id)
notice = list [notice type = string ("Injury", "Suspended"), point of interest]

SET
sub = adds the value given to the substitutions of the team thats the given id

---League (id = league division)
teams = list of ints*
division sizes  = [int numbers of divisions, teams per division divided by 2]
round = int

---Season
day = [tournament name = string, tournament round = int]
year = int
latest news = list of news [news type = string, [points of interest]]

---Human 
team = int*
current = int 
team colors = list of strings [color1, color2]

*/

export class InfoHandler {
    constructor(info) {
        this.savedStates = {}
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
        this.playersTeam = []
        this.playersTeam[1] = 1

        this.teamsIn = this.all_teams();
        this.teamsOut = [];
        this.divisions = 4
        this.divisions_size = 8
        this.promotionSpots = 2

        this.cup_directs_size = (60/100) * this.divisions_size
        this.cup_directs_phase = 3
        this.cup_prelim_size = 10
        this.divisionsTeams = {}
        this.cupTeams = []
        this.cupRoundTeams = [] 
        //this.next_tourn = "League"
        //this.season = 2020
        this.startingSeason = 2020
        this.currentSeason = this.startingSeason
        this.seasonGames = {League: [], Cup: []}
        this.currentMatches = []
        this.allNews = [[["Text", "The " + this.currentSeason + " season has started!"]]]
        this.extremesStrengths = [50, 1]
        this.currentDayState = 0
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

    findInArray(x, a) {
        for (let i = 0 ; i < a.length ; i++) {
            if (a[i] === x) {
                return i
            }
        }
        return -1
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

    initialization(action, ids) {
        if (action === "Teams In") {
            return this.teamsIn
        } else if (action === "Teams Out") {
            return this.teamsOut
        } else if (action === "Get") {
            return [this.baseInfo[ids]["color1"], this.baseInfo[ids]["color2"], this.baseInfo[ids]["name"]]
        } else if (action === "Remove") {
            let mover = 0
            let i = this.findInArray(ids[0], this.teamsIn)
            if (i + 1) {mover = this.teamsIn.splice(i, 1)}
            this.teamsOut.push(mover)
        } else if (action === "Add") {
            let mover = 0
            let i = this.findInArray(ids[0], this.teamsIn)
            if (i + 1) {mover = this.teamsOut.splice(i, 1)}
            this.teamsIn.push(mover)
        } else if (action === "Player") {
            this.playersTeam[1] = ids[0]
        } else if (action === "Get Player") {
            return this.playersTeam[ids[0]]
        } else if (action === "Initialize") {
            this.teamsPlaying = this.teamsIn.slice()
            this.teamsPlaying.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})
            let temp = this.teamsPlaying.slice()
            //temp.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})
            let i = this.findInArray(this.playersTeam[1], temp)
            if (i + 1) { temp.splice(i, 1) }
            let hP = this.baseInfo[temp[0]]["strength"]
            let lP = this.baseInfo[temp[temp.length - 1]]["strength"]
            this.extremesStrengths = [hP, lP]

            for (let x = 1 ; x < this.divisions ; x++) {
                this.divisionsTeams[x] = temp.splice(0, this.divisions_size)
            }
            this.divisionsTeams[this.divisions] = temp.splice(0, this.divisions_size - this.numberOfPlayers)
            let divt = this.divisionsTeams[this.divisions]
            let avgPower = divt.reduce((t, e) => {return t + this.baseInfo[e]["strength"]}, 0) / divt.length
            //console.log(avgPower)
            this.playersTeam.forEach((e, i) => {
                if (!(i)) { return }
                this.baseInfo[e]["strength"] = avgPower;
                this.divisionsTeams[this.divisions].push(e)}
                )
            this.teamsPlaying.sort((e1, e2) => {return this.baseInfo[e2]["strength"] - this.baseInfo[e1]["strength"]})

            this.numberOfTeams = this.teamsPlaying.length
            this.cupSize = 0;
            this.cupRounds = 0;
            [2, 4, 8, 16, 32, 64, 128, 256].forEach(
                (e, i, a) => {
                    if (i === a.length - 1) {
                        if (!this.cupSize) { this.cupSize = e ; this.cupRounds = i + 1 }
                    } else if (e <= this.numberOfTeams && a[i + 1] > this.numberOfTeams) {
                        this.cupSize = e
                        this.cupRounds = i + 1
                    }
                }
            );
            temp = this.teamsPlaying.slice()
            this.cupTeams = temp.splice(0, this.cupSize)
            this.cupRoundTeams = this.cupTeams.slice()
            this.rankedTeams = this.teamsPlaying.slice()
            this.initializeNewSessionInfo()
            this.runSeason("Start")
        }
    }

    initializeNewSessionInfo() {
        for (let x = this.teamsRange[0] ; x <= this.teamsRange[1] ; x++) {
            let pl = this.baseInfo[x]["players"]
            let coach = this.baseInfo[x]["coach"]
            pl.forEach(element => {this.baseInfo[element]["teamID"] = x}) 
            this.baseInfo[coach]["teamID"] = x
            if (!(this.inArray(x, this.teamsPlaying))) { continue }
            let team = this.baseInfo[x]
            let processed_team = team
            let new_properties = ["moral", "finances", "stadium", "wins"]
            let new_values = [this.randomInt(1, 100), [1000000, 0, 0, 0, 0, 0], 1, [0, 0, 0]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_team[new_properties[l]] = new_values[l]
            } 
            this.sessionInfo[processed_team["id"]] = processed_team
        }

        for (let x = this.coachesRange[0] ; x <= this.coachesRange[1] ; x++) {
            if (!(this.inArray(this.baseInfo[x]["teamID"], this.teamsPlaying))) { continue }
            this.coachesPlaying.push(x)
            let coach = this.baseInfo[x]
            let processed_coach = coach
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract", "wins"]
            let new_values = [this.randomInt(1, 100), [1, 0], this.randomInt(1, 50), "FP", [0, this.randomInt(1, 100000), this.randomInt(1, 100000)], [0, 0, 0]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_coach[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_coach["id"]] = processed_coach
            //console.log(processed_coach)
            
        }

        for (let x = this.playersRange[0] ; x <= this.playersRange[1] ; x++) {
            if (!(this.inArray(this.baseInfo[x]["teamID"], this.teamsPlaying))) { continue }
            this.playersPlaying.push(x)
            let player = this.baseInfo[x]
            let processed_player = player
            let thisPower = this.baseInfo[this.baseInfo[x]["teamID"]]["strength"]
            let highestPower = this.extremesStrengths[0]
            //let lowestPower = this.extremesStrengths[1]
            let highEnd = Math.floor( (thisPower / highestPower) * 50 )
            if (highEnd < 5) { highEnd = 5 } 
            let lowEnd = highEnd - 4
            let playerPower = this.randomInt(lowEnd, highEnd)
            let new_properties = ["moral", "situation", "strength", "behaviour", "contract", "history", "season history", "wins"]
            let new_values = [this.randomInt(1, 100), [0, 0], playerPower, "FP", [0, playerPower * 500, playerPower * 10000], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0]]
            for (let l = 0 ; l < new_properties.length ; l++) {
                processed_player[new_properties[l]] = new_values[l]
            }
            this.sessionInfo[processed_player["id"]] = processed_player
        }

        for (let x = 1 ; x <= this.numberOfPlayers ; x++) {
            this.sessionInfo[this.playersTeam[x]]["coach"] = -x
        }

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
        let rotation = [defenders, mids, forwards]
        if (!(formation.length === 3 && (formation[0] + formation[1] + formation[2] === 10))) {
            formation = [4, 3, 3]
        }

        let formationPlayers = []
        if (goalkeepers.length) { formationPlayers.push(goalkeepers.splice(0, 1)) }
        while ((defenders.length + mids.length + forwards.length > 0) && formationPlayers.length < 11) {
            for (let p = 0 ; p < 3 ; p++) {
                let ps = rotation[p].splice(0, formation[p])
                //console.log(ps)
                formationPlayers = formationPlayers.concat(ps)
            }
        }
        formationPlayers.forEach((e) => {this.sessionInfo[e]["situation"][0] = 1})

        let reservePlayers = []
        if (goalkeepers.length) { reservePlayers.push(goalkeepers.splice(0, 1)) }
        while ((defenders.length + mids.length + forwards.length > 0) && reservePlayers.length < 7) {
            for (let p = 0 ; p < 3 && reservePlayers.length < 7 ; p++) {
                let ps = rotation[p].splice(0, 1)
                //console.log(ps)
                reservePlayers = reservePlayers.concat(ps)
            }
        }
        reservePlayers.forEach((e) => {this.sessionInfo[e]["situation"][0] = 2})
    }

    rankTeams() {
        this.rankedTeams = this.teamsPlaying.slice()
        this.rankedTeams.sort((a, b) => {return this.seasonRanking[b] - this.seasonRanking[a]})
    }

    cupSorting() {
        let day = this.seasonCalendar[this.seasonDay]
        /*
        let teams = this.shuffle(this.cupTeams)
        if (day[1] > 0) {
            let lastMatches = this.seasonGames["Cup"][day[1] - 1]
            let pseudoTeams = []
            for (let x = 0 ; x < lastMatches.length ; x++) {
                let match = lastMatches[x]
                if (match[4] === match[0]) {
                    pseudoTeams.push(match[0])
                } else {
                    pseudoTeams.push(match[1]) // NOT HANDLING DRAWS YET
                }
            }
            teams = pseudoTeams
        }*/
        let teams = this.cupRoundTeams.slice()
        for (let l = 0 ; l < teams.length/2 ; l++) {
            let match = [teams[l], teams[teams.length - 1 - l], 0, 0, 0, "Cup", this.cupSize/(Math.pow(2, day[1])), (day[1] + 1), this.currentSeason, false]
            this.seasonGames["Cup"][day[1]].push(match)
        }
        this.cupRoundTeams = []
        //console.log("Sorted cup matches", this.seasonGames["Cup"])
        //console.log("day", day)
    }

    seasonGamesMaker() {
        let games = {league: []}
        for (let z = 1 ; z <= this.divisions ; z++) {
            let turn1 = []
            let fixedTeam = this.divisionsTeams[z][0]
            let rotation = this.shuffle(this.divisionsTeams[z].slice(1, this.divisionsTeams.length))
            let count = 1
            for (let x = 0 ; x < this.divisions_size - 1 ; x++) {
                let day = []
                let t = rotation.slice()
                t.unshift(fixedTeam)
                //console.log(t)
                for (let y = 0 ; y < this.divisions_size/2 ; y++) {
                    let match = [t[y], t[t.length - 1 - y], 0, 0, 0, "League", z, count, this.currentSeason, false]
                    day.push(match)
                }
                turn1.push(day)
                rotation.unshift(rotation.pop())
                count += 1
            }

            let turn2 = []
            for (let x = 0 ; x < turn1.length ; x++) {
                turn2.push([])
                for (let y = 0 ; y < turn1[x].length ; y++) {
                    let match = turn1[x][y]
                    let returnMatch = match.slice()
                    returnMatch[0] = match[1]
                    returnMatch[1] = match[0]
                    returnMatch[7] = match[7] + this.divisions_size - 1
                    turn2[x].push(returnMatch)
                }
            }
            
            games["league"][z] = turn1.concat(turn2)
        } // league games finished

        //console.log("season league games", games)
        //console.log(this.divisionsTeams)

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
    }

    setupTournaments() {
        let demoting = []
        let promoting = []
        for (let div = 1 ; div <= this.divisions ; div++) {
            if (div !== 1) {
                promoting = this.divisionsTeams[div].splice(0, this.promotionSpots)
                this.divisionsTeams[div - 1] = this.divisionsTeams[div - 1].concat(promoting)
                this.divisionsTeams[div] = demoting.concat(this.divisionsTeams[div])
            }
            demoting = this.divisionsTeams[div].splice(this.divisions_size - this.promotionSpots, this.promotionSpots)
        }
        let count = 0
        for (let t = 0 ; t < this.rankedTeams.length && count < this.promotionSpots ; t++) {
            let team = this.rankedTeams[t]
            let continue_switch = false
            for (let div = 1 ; div <= this.divisions ; div++) {
                if (this.inArray(team, this.divisionsTeams[div])) { continue_switch = true; break }
            }
            if (continue_switch || this.inArray(team, demoting)) {continue}
            this.divisionsTeams[this.divisions].push(team)
            count += 1
        }
        this.last5yearRanking = {}
        for (let x = this.currentSeason - 1 ; x >= this.startingSeason && x >= this.currentSeason - 5 ; x--) {
            for (let y = 0 ; y < this.teamsPlaying ; y++) {
                let team = this.teamsPlaying[y]
                this.last5yearRanking[team] += this.pastSeasons[x]["ranking"][team]
            }
        }
        this.tempTeams = this.teamsPlaying.slice()
        this.tempTeams.sort((a, b) => {return this.last5yearRanking[b] - this.last5yearRanking[a]})
        this.cupTeams = this.tempTeams.slice(0, this.cupSize)
        this.cupRoundTeams = this.cupTeams.slice()
    }

    nextMatches() {
        //console.log("getting next matches")
        //console.log(this.currentSeason, this.seasonGames)
        let day = this.seasonCalendar[this.seasonDay]
        if (day[0] === "Cup") { this.cupSorting() } 
        this.currentMatchesHistory = []
        this.currentMatchesReturnHistory = []
        this.currentMatchesExtras = []
        this.allNews.push([])
        this.currentNotices = []
        this.currentMatches = this.seasonGames[day[0]][day[1]]
        for (let y = 0 ; y < this.currentMatches.length ; y++) {
            this.currentMatchesHistory.push([{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}])
            this.currentMatchesReturnHistory.push([{time: 0,  stat:'Start',  text: "Match Start", teamID: '0', playerID: '0', player:'0'}])
            this.currentMatchesExtras.push({ extra : -1, lastPossession: 0, subs: [0, 0] })
        }
        //console.log(this.currentMatches)
    }

    runSeason(action) {
        if (action === "Start") {
            if (this.currentSeason !== this.startingSeason) {
                this.pastSeasons[this.currentSeason - 1] = {ranking: this.seasonRanking, standings: this.leagueStandings, games: this.seasonGames, calendar: this.seasonCalendar}
                this.setupTournaments()
            }
            this.seasonGamesMaker()
            this.seasonRanking = {}
            for (let x = 0 ; x < this.teamsPlaying.length ; x++) {
                this.seasonRanking[this.teamsPlaying[x]] = 0
            }
            this.leagueStandings = {}
            for (let div = 1 ; div <= this.divisions ; div++) {
                for (let t = 0 ; t < this.divisionsTeams[div].length ; t++) {
                    let teamID = this.divisionsTeams[div][t]
                    this.leagueStandings[teamID] = [0, 0, 0, 0, 0, 0, 0, div]
                }
            }
            for (let x = 0 ; x < this.playersPlaying.length ; x++) {
                let playerID = this.playersPlaying[x]
                this.sessionInfo[playerID]["season history"] = [0, 0, 0, 0, 0]
            }
            this.seasonCalendar = []
            for (let x = 0 ; x < this.seasonGames["League"].length ; x++){
                this.seasonCalendar.push(["League", x])
            }
            this.seasonGames["Cup"] = []
            for (let x = 0 ; x < this.cupRounds ; x++) {
                this.seasonGames["Cup"].push([])
                let l = this.seasonCalendar.length
                this.seasonCalendar.splice(l-(3*x), 0, ["Cup" , this.cupRounds-x-1])
            }
            this.seasonDay = 0
            //console.log(this.seasonCalendar)
            //console.log(this.seasonGames["league"][1])
            this.nextMatches()
        } else if (action === "End day") {
            for (let x = 0 ; x < this.currentMatches.length ; x++) {
                let match = this.currentMatches[x]
                match[match.length - 1] = true;
                if (match[2] > match[3]) {
                    match[4] = match[0]
                } else if (match[2] < match[3]) {
                    match[4] = match[1]
                }
                // standing = [0 = matches played, 1 = victories, 2 = draw, 3 = defeats, 4 = goals made, 5 = goals taken, 6 = points, 7 = division]
                let home = match[0]
                let away = match[1]
                let winner = match[4]
                let loser = 0
                if (winner !== 0) {loser = (winner === home) ? away : home}
                if (match[5] === "League") {
                    this.leagueStandings[home][0] += 1
                    this.leagueStandings[away][0] += 1
                    this.leagueStandings[home][4] += match[2]
                    this.leagueStandings[away][4] += match[3]
                    this.leagueStandings[home][5] += match[3]
                    this.leagueStandings[away][5] += match[2]
                    if (winner === 0) {
                        this.leagueStandings[away][2] += 1
                        this.leagueStandings[home][2] += 1
                        this.leagueStandings[away][6] += 1
                        this.leagueStandings[home][6] += 1
                    } else {
                        this.leagueStandings[winner][1] += 1
                        this.leagueStandings[winner][6] += 3
                        this.leagueStandings[loser][3] += 1
                        this.seasonRanking[winner] += 1
                    }
                } else if (match[5] === "Cup") {
                    if (winner === 0) { match[4] = match[0] }
                    this.cupRoundTeams.push(match[4])
                } else {
                    console.log("ERROR")
                }
            }
            for (let z = 1 ; z <= this.divisions ; z++) {
                this.divisionsTeams[z].sort((e1, e2) => {return this.sortDivision(e1, e2)})
            }
            this.rankTeams()
            this.seasonDay += 1
            //console.log(this.seasonDay)
            if (this.seasonDay >= this.seasonCalendar.length) {
                let leagueWinner = this.divisionsTeams[1][0]
                let cupWinner = this.cupRoundTeams[0]
                let topGoalScorer = 0
                let goals = 0
                for (let x = 0 ; x < this.playersPlaying.length ; x++) {
                    let p = this.playersPlaying[x]
                    let g = this.sessionInfo[p]["season history"][1]
                    //console.log(p, g)
                    if (g > goals) { goals = g ; topGoalScorer = p}
                }
                this.seasonWinProcesser(topGoalScorer, "Goalscorer")
                this.seasonWinProcesser(leagueWinner, "League")
                this.seasonWinProcesser(cupWinner, "Cup")

                this.allNews[this.allNews.length - 1].push(["Season Winners", [leagueWinner, cupWinner, topGoalScorer]])

                this.currentSeason += 1
                this.runSeason("Start")
            } else {
                this.nextMatches()
            }
            
        }
    }

    seasonWinProcesser(id, winType) {
        let cash, i, players;
        let tID = id
        if (winType === "League") {
            cash = 20000000
            i = 0
            players = this.sessionInfo[id]["players"].slice()
        } else if (winType === "Cup") {
            cash = 6000000
            i = 1
            players = this.sessionInfo[id]["players"].slice()
        } else if (winType === "Goalscorer") {
            cash = 3000000
            i = 2
            players = [id]
            tID = this.sessionInfo[id]["teamID"]
        }
        this.sessionInfo[tID]["finances"][0] += cash
        this.sessionInfo[tID]["wins"][i] += 1
        players.forEach((e) => {this.sessionInfo[e]["wins"][i] += 1})
        this.sessionInfo[this.sessionInfo[tID]["coach"]]["wins"][i] += 1
    }

    sortDivision(e1, e2) {
        // points, goal diff, h2h, victories, vermelho, amarelo, untie match
        let s1 = this.leagueStandings[e1]
        let s2 = this.leagueStandings[e2]
        let points = [s1[6], s2[6]]
        let goalDiff = [s1[4] - s1[5], s2[4] - s2[5]]
        let goalsFor = [s1[4], s2[4]]
        let victories = [s1[1], s2[1]]
        let score = [0, 0]
        for (let x = 0 ; x < this.seasonGames["League"].length ; x++) {
            let dayGames = this.seasonGames["League"][x]
            for (let y = 0 ; y < dayGames.length ; y++) {
                let match = dayGames[y]
                if (match[0] === e1 && match[1] === e2) {
                    score[0] += match[2]
                    score[1] += match[3]
                } else if (match[1] === e1 && match[0] === e2) {
                    score[0] += match[3]
                    score[1] += match[2]
                }
            }
        }
        let unties = [points, goalDiff, goalsFor, score, victories]
        for (let z = 0 ; z < unties.length ; z++) {
            let untie = unties[z]
            if (untie[0] !== untie[1]) {
                return untie[1] - untie[0]
            } 
        }
        return 0
    }

    searchTeamMatches(id, season = "all") {
        let mH = []
        if (season === "all" || season === "past") {
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
        if (season === "all" || season === "current") {
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
        }
        if (season === "day") {
            let dayMatches = this.currentMatches
            for (let m = 0 ; m < dayMatches.length ; m++) {
                let match = dayMatches[m]
                if (match[0] === id || match[1] === id) {
                    mH.push(match)
                }
            }
        }
        return mH
    }

    lastH2H(id1, id2) {
        let mS = this.searchTeamMatches(id1)
        for (let x = mS.length - 1 ; x >= 0 ; x--) {
            let match = mS[x]
            if (match[0] === id2 || match[1] === id2) {
                if (match[9]) {return match}
            }
        }
        return null
    }

    get(section, id, property) {
        if (property === undefined || id === undefined || property === undefined) {
            console.log("something went wrong and is undefined", section, id, property)
        }

        if (section === "Team") {
            if (property === "all") {
                return this.sessionInfo[id]
            } else if (id === 0) {
                return this.rankedTeams.slice()
            } else if (property === "next match") {
                for (let x = 0 ; x < this.currentMatches.length ; x++) {
                    let match = this.currentMatches[x]
                    let returnV = 0
                    //console.log(match)
                    if (match.slice(0, 2).includes(id)) { 
                        returnV = (match[0] === id) ? [match, this.lastH2H(id, match[1])] : [match, this.lastH2H(id, match[0])] 
                        //console.log(section, id, property, returnV)
                        return returnV
                    }
                }
                console.log("did not find next opponent", id)
                return null
            } else if (property === "league division") {
                for (let x = 1 ; x <= this.divisions ; x++) {
                    if (this.divisionsTeams[x].includes(id)) {
                        return x
                    }
                }
            } else if (property === "standing") {
                let fakeStandings = [0, 0, 0, 0, 0, 0, 0, 19];
                let st = this.leagueStandings[id];
                return (st) ? st : fakeStandings;
            } else if (property === "calendar") {
                return this.searchTeamMatches(id, "current")
            } else if (property === "history") {
                return this.searchTeamMatches(id)
            } else if (property === "is human") {
                return this.inArray(id, this.playersTeam)
            } else if (property === "current matches id") {
                for (let x = 0 ; x < this.currentMatches.length ; x++) {
                    if (this.currentMatches[x][0] === id || this.currentMatches[x][1] === id) { return x }
                }
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
            } else if (property === "sub") {
                let teamID = id
                if (id >= 10000) {teamID = this.sessionInfo[id]["teamID"]}
                let match = this.searchTeamMatches(teamID, "day")[0]
                let i = this.findInArray(match, this.currentMatches)
                return this.currentMatchesExtras[i]["subs"][(teamID === match[0]) ? 0 : 1]
            } else if (property === "notice") {
                if (this.currentNotices.length > 0) {return this.currentNotices.splice(0, 1)}
                else {return ["Nothing"]}
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
            } else if (property === "latest news") {
                return this.allNews[this.allNews.length - 2]
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

        if (section === "Saved State") {
            if (this.savedStates[property] !== undefined) {return this.savedStates[property]}
            else {return null}
        }

        console.log([section, id, property, "Get didnt return"])
    }

    set(section, id, property, value) {
        if (section === "Team") {
            if (property === "all") {
                this.sessionInfo[id] = value
            } else if (property === "formation") {
                this.formationSetter(id, value)
            } else if (property === "purchase") {
                let availability = this.sessionInfo[value]["contract"][1]
                if (!availability) { return [false, "Not available for sale"]}
                let cost = this.sessionInfo[value]["contract"][2]
                let teamMoney = this.sessionInfo[id]["finances"][0]
                if (cost > teamMoney) { return [false, "Too expensive"] }
                this.sessionInfo[id]["finances"][0] -= cost
                let removeID = this.findInArray(value, this.sessionInfo[this.sessionInfo[value]["teamID"]]["players"])
                this.sessionInfo[this.sessionInfo[value]["teamID"]]["players"].splice(removeID, 1)
                this.sessionInfo[value]["teamID"] = id
                this.sessionInfo[id]["players"].push(value)
                return [true, "Purchase successful"]
            } else {
                this.sessionInfo[id][property] = value
            }
        }
        else if (section === "Player") {
            if (property === "all") {
                this.sessionInfo[id] = value
            } else {
                this.sessionInfo[id][property] = value
            }
        }
        else if (section === "Match") {
            if (property === "sub") {
                let teamID = id
                if (id >= 10000) {teamID = this.sessionInfo[id]["teamID"]}
                let match = this.searchTeamMatches(teamID, "day")[0]
                let i = this.findInArray(match, this.currentMatches)
                this.currentMatchesExtras[i]["subs"][(teamID === match[0]) ? 0 : 1] += value
            }
        }
        else if (section === "League") {
        }
        else if (section === "Cup") {
        }
        else if (section === "Human") {
        }
        else if (section === "Saved State") {
            this.savedStates[property] = value
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

    runMatches(time, half) {
        if (time >= 1 && this.currentDayState < 2) {
            let endSwitch = true
            this.currentDayState = 1
            for (let x = 0 ; x < this.currentMatches.length ; x++) {
                let done = this.runMatch(x, time, half)
                if (!done) { endSwitch = false }
            }
            return endSwitch
        } else if (time === -1) {
            this.currentDayState = 2
        } else if (time === -2) {
            this.currentDayState = 0
            this.runSeason("End day")
        }
    }
      
    runMatch(matchID, time, half){
        //{time: 0,  stat:'S',  text: goalIcon, teamID:'cruzeiro1921', playerID: '0', player:'0'}
        //console.log("running match", matchID)
        let history = this.currentMatchesHistory[matchID] 
        let cMatch = this.currentMatches[matchID]
        let cMatchExtras = this.currentMatchesExtras[matchID]
        if (time === 45) { cMatchExtras["extra"] = this.randomInt(0,5) }
        if (45 + cMatchExtras["extra"] < time) { return true }
        time = time + (half - 1) * 45
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
                this.sessionInfo[player]["history"][1] += 1
                this.sessionInfo[player]["season history"][1] += 1
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
        return false
    }
}