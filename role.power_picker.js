/*
 * @Author: zhanglin 
 * @Date: 2022-02-10 10:47:16 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-11 19:07:12
 */
let utils = require('./utils')
let observe = require('./role.observe')
let { deleteDeposit } = observe
let { isMyRoom } = utils
let { goToTargetRoom } = utils


const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';
const HEAL = 'heal';
const TOUGH = 'tough'
let rooms = {
    E39N41: { list: 1, amount: 0, size: { move: 10, carry: 40 }, },
    E43N51: { list: 1, amount: 0, size: { move: 10, carry: 40 }, },
    E49N51: { list: 1, amount: 0, size: { move: 10, carry: 40 }, },
    E41N49: { list: 1, amount: 0, size: { move: 10, carry: 40 }, },
    E46N51: { list: 1, amount: 0, size: { move: 10, carry: 40 }, },

};


let rolePowerPicker = {
    main: function () {
        for (let room in rooms) {
            if (!isMyRoom(room)) continue
            let role1 = room + "powerPicker"
            // console.log(role1);
            let pickCreep1 = _.filter(Game.creeps, (creep) => creep.memory.role1 == role1);
            console.log(room+"picker" + pickCreep1.length);
            for (let j = 0; j < pickCreep1.length; j++) {
                if (this.pickPower(pickCreep1[j])) this.putPower(pickCreep1[j], Game.rooms[pickCreep1[j].memory.roomName].storage)
            }
            let { powerBanks } = Game.rooms[room].memory
            if (!powerBanks || !powerBanks.length) continue

            for (let i = 0; i < powerBanks.length; i++) {
                let bank = powerBanks[i]
                console.log(bank.id+bank.finish?"finish":"attacking");
                
                if (!bank.finish) break
                let id = bank.id
                let powerAmount = bank.power
                let amount = (powerAmount + 1999) / 2000
                //表明身份
                // 表明bankId
                let role2 = room + "powerPicker" + id
                let pickCreep2 = _.filter(Game.creeps, (creep) => creep.memory.role2 == role2);
                if (pickCreep2.length < amount) this.spawn(room, bank)
            }
        }
    },
    spawn(room, bank) {
        let id = bank.id
        let role1 = room + "powerPicker"
        let role2 = role1 + id
        let sizeArray = { carry: 40, move: 10 }
        let name = role1 + Game.time;
        let size = new Array();
        for (let key in sizeArray) {
            for (let keyLength = 0; keyLength < sizeArray[key]; keyLength++) {
                size.push(key);
                // console.log(size)
            }
        }
        let spawns = Game.rooms[room].spawn
        for (let i = 0; i < spawns.length; i++) {
            spawns[i].spawnCreep(size, name,
                { memory: { role1: role1, role2: role2, roomName: room, replace: 0, bank: bank } })
            if (spawns[i].spawning) {
                var spawningCreep = Game.creeps[spawns[i].spawning.name];
                spawns[i].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawns[i].pos.x + 1,
                    spawns[i].pos.y,
                    { align: 'left', opacity: 0.8 });
            }
        }
    },
    pickPower(creep) {
        let { bank } = creep.memory
        let { id } = bank
        let { pos } = bank
        let targetRoomName = pos.roomName
        // console.log("hello");
        if (!creep.memory.status) {
            if (!goToTargetRoom(creep, targetRoomName)) return false
            let power = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (resource) => {
                    return resource.resourceType == RESOURCE_POWER;
                }
            });
            let power_ruin = creep.room.find(FIND_RUINS, {
                filter: (ruin) => {
                    return ruin.store[RESOURCE_POWER] > 0;
                }
            });
            let powerBank = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_POWER_BANK;
                }
            });
            if (powerBank.length) {
                creep.moveTo(new RoomPosition(25,25,creep.room.name))
            }
            if (power_ruin.length) {
                if (creep.withdraw(power_ruin[0], RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(power_ruin[0])
                }
            }
            if (power.length) {
                if (creep.pickup(power[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(power[0])
                }
            }
            if (creep.store.getFreeCapacity() == 0 || (powerBank.length == 0 && power_ruin.length == 0 && power.length == 0)) {
                creep.memory.status = 1
            }
            return false
        }
        else return true
    },

    /**
     * creep将资源放到指定建筑物中
     * @param {*} creep 
     * @param {目标建筑物} target 
     */
    putPower(creep, target) {
        if (target) {
            let resources = Object.keys(creep.store)
            if (resources.length) {
                if (creep.transfer(target, resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else creep.suicide()
        }
    }
};



module.exports = rolePowerPicker;



