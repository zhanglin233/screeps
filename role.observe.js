/*
 * @Author: zhanglin 
 * @Date: 2022-02-09 16:57:06 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-10 20:12:46
 */

let utils = require("utils")
const { isMyRoom } = utils
//deposit房
let rooms1 = {
    // E39N41: ['E40N42', 'E40N40', 'E40N41'],
    E46N51: ['E45N50', 'E46N50', 'E47N50'],
    E43N51: ['E42N50', 'E43N50', 'E44N50'],
    E41N49: ['E39N50', 'E41N50', 'E40N49', 'E40N50'],
    // E43N54: { list: 2, amount: 1, size: { carry: 15, move: 8 } },
    // E49N51: ['E46N50', 'E47N50', 'E48N50', 'E49N50', 'E50N50', 'E50N51', 'E50N52', 'E50N53', 'E50N54'],
    E49N51: ['E48N50', 'E49N50', 'E50N50', 'E50N51', 'E50N52'],
    // E43N54: ['E40N54']
};
//pb房
let rooms2 = {
    // E39N41: ['E40N42', 'E40N40', 'E40N41'],
    E46N51: ['E45N50', 'E46N50', 'E47N50'],
    E43N51: ['E42N50', 'E43N50', 'E44N50'],
    E41N49: ['E41N50', 'E40N49', 'E40N50', 'E40N51'],
    // E43N54: { list: 2, amount: 1, size: { carry: 15, move: 8 } },
    E49N51: ['E48N50', 'E49N50', 'E50N50', 'E50N51', 'E50N52', 'E50N53', 'E50N54'],
    //   E49N51: ['E48N50', 'E49N50', 'E50N50', 'E50N51', 'E50N52'],

};
let observe = {
    main: function () {
        for (let room in rooms2) {

            let targetRooms = rooms2[room]
            // console.log(targetRooms);
            if (isMyRoom(room)) {
                let observe = Game.getObjectById(Game.rooms[room].memory.observe[0].observeId)
                // console.log(room+observe);
                let targetRooms_length = targetRooms.length
                let targetRoom = targetRooms[Math.round(Math.random() * targetRooms_length)]
                // console.log(observe);
                if (!observe) continue
                observe.observeRoom(targetRoom)
                this.find_deposit(room, targetRoom)
                // console.log(room);
                this.find_power_banks(room, targetRoom)
            }
        }

    },
    /**
     * 寻找powerBanks
     * @param {String} roomName 
     * @param {String} targetRoom 
     */
    find_power_banks(roomName, targetRoom) {
        // console.log(roomName);
        let room = Game.rooms[roomName]
        if (!room.memory.powerBanks) {
            room.memory.powerBanks = []
        }
        if (Game.rooms[targetRoom]) {
            let powerBanks = Game.rooms[targetRoom].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_POWER_BANK;
                }
            });
            for (let i = 0; i < powerBanks.length; i++) {
                let powerBank = powerBanks[i]
                // console.log(room.name+deposit.lastCooldown);
                if (powerBank.ticksToDecay > 3900 && powerBank.power > 3000) {
                    if (JSON.stringify(room.memory.powerBanks[room]) == "[]") {
                        room.memory.powerBanks.push(powerBank)
                    }
                    else {
                        if (this.checkBankId(room, powerBank.id)) room.memory.powerBanks.push(powerBank)
                    }
                }
                // else {
                //     if (this.checkId) this.deleteDeposit(room, deposit.id)
                // }
            }

        }

    },

    checkBankId(room, id) {
        let { powerBanks } = room.memory
        for (let i = 0; i < powerBanks.length; i++) {
            if (id == powerBanks[i].id) return false
        }
        return true
    },
    /**
     * 删去room的memory中id为的id的deposit
     * @param {Room} room 
     * @param {string} id 
     */
    deleteBank(room, id) {
        let { powerBanks } = room.memory
        for (let i = 0; i < powerBanks.length; i++) {
            if (id == powerBanks[i].id) powerBanks.splice(i, 1)
        }
    },

    /**
     * 查找targetRoom中的deposit并将找到的deposit信息存入房间roomName的memory中
     * @param {目标房间名字} roomName 
     * @param {目标房间名字} targetRoom 
     */
    find_deposit(roomName, targetRoom) {
        let room = Game.rooms[roomName]
        if (!room.memory.deposits) {
            room.memory.deposits = []
        }
        if (Game.rooms[targetRoom]) {
            let deposits = Game.rooms[targetRoom].find(FIND_DEPOSITS)
            if (deposits.length) {
                for (var deposit of deposits) {
                    // console.log(room.name+deposit.lastCooldown);
                    if (deposit.lastCooldown < 100) {
                        let target = {
                            id: deposit.id,
                            pos: deposit.pos,
                            room: deposit.room,
                            depositType: deposit.depositType,
                            lastCooldown: deposit.lastCooldown,
                        }
                        if (JSON.stringify(room.memory.deposits[room]) == "[]") {
                            room.memory.deposits.push(target)
                        }
                        else {
                            if (this.checkDepositId(room, deposit.id)) room.memory.deposits.push(target)
                        }
                    }

                    else {
                        if (this.checkDepositId(room, deposit.id)) this.deleteDeposit(room, deposit.id)
                    }
                }
            }
        }
    },
    /**
     * 检查room的memory中是否含有id的deposit
     * @param {Room} room 
     * @param {string} id 
     * @returns 
     */
    checkDepositId(room, id) {
        let { deposits } = room.memory
        for (let i = 0; i < deposits.length; i++) {
            if (id == deposits[i].id) return false
        }
        return true
    },
    /**
     * 删去room的memory中id为的id的deposit
     * @param {Room} room 
     * @param {string} id 
     */
    deleteDeposit(room, id) {
        let { deposits } = room.memory
        for (let i = 0; i < deposits.length; i++) {
            if (id == deposits[i].id) deposits.splice(i, 1)
        }
    }
};

module.exports = observe;