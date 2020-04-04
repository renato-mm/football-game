export class InfoHandler {
    constructor(info) {
        this.baseInfo = info;
        this.teamsIn = this.all_teams();
        this.teamsOut = [];
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
        }
    }

    all_teams(ids) {
        let returnArray = [];
        for (let x = 1 ; x < 1000 ; x++) {
            if (this.baseInfo[x]) {
                returnArray.push(this.baseInfo[x])
            }
        }
        return returnArray;
    }
}