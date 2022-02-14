/*
 * @Author: zhanglin 
 * @Date: 2022-02-10 10:29:24 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-11 19:07:44
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
const HEAL = 'heal'

let rooms = {
    E43N51: { list: 1, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E43N54: { list: 2, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E49N51: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E43N55: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E41N49: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E46N51: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    W12N55: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E39N41: { list: 2, amount: 1, size: { carry: 20, move: 10 } },


};

let roleSpawnHarvester = {
    main: function () {
        let amount = 1

        for (let room in rooms) {
            if (!isMyRoom(room)) continue
            let { powerBanks } = Game.rooms[room].memory
            if (!powerBanks || !powerBanks.length) continue
            for (let i = 0; i < powerBanks.length; i++) {
                let bank = powerBanks[i]
                console.log(room+"挖取powerBank"+bank.id);
                let id = bank.id
                let attackRole = room + "attackBank" + id
                let healRole = room + "healAttack" + id
                let attackCreep = _.filter(Game.creeps, (creep) => creep.memory.role == attackRole);
                let healCreep = _.filter(Game.creeps, (creep) => creep.memory.role == healRole);

                for (let j = 0; j < attackCreep.length; j++) {
                    if(!attackCreep[j]) continue
                    // console.log(attackCreep[j]);
                    this.attackBank(attackCreep[j],bank)
                    if (attackCreep[j].ticksToLive < 300 && attackCreep[j].memory.replace == 0) {
                        
                        if(this.spawn(room, attackRole, bank)) attackCreep[j].memory.replace = 1
                    }
                }
                for (let j = 0; j < healCreep.length; j++) {
                    if(!healCreep[j])continue
                    this.healAttacker(healCreep[j])
                    if (healCreep[j].ticksToLive < 330 && healCreep[j].memory.replace == 0) {
                        
                        if(this.spawn(room, healRole, bank)) healCreep[j].memory.replace = 1
                    }
                }
                if (healCreep.length < amount) {
                    this.spawn(room, healRole, bank)
                }
                if (attackCreep.length < amount) {
                    this.spawn(room, attackRole, bank)
                }
            }
        }
    },
    spawn(room, role, bank) {
        let id = bank.id
        let attackRole = room + "attackBank" + id
        let healRole = room + "healAttack" + id
        let sizeArray = {}
        if (role == attackRole) {
            sizeArray = { attack: 20, carry: 0, move: 20 }
        }
        if (role == healRole) {
            sizeArray = { heal: 25, move: 25 }
        }

        let name = role + Game.time;
        let size = new Array();
        for (let key in sizeArray) {
            for (let keyLength = 0; keyLength < sizeArray[key]; keyLength++) {
                size.push(key);
                // console.log(size)
            }
        }
        // console.log(size)
        let spawns = Game.rooms[room].spawn
        for (let i = 0; i < spawns.length; i++) {
            if(spawns[i].spawnCreep(size, name,
                { memory: { role: role, roomName: room, replace: 0, bank: bank } })==0) return true
            if (spawns[i].spawning) {
                var spawningCreep = Game.creeps[spawns[i].spawning.name];
                spawns[i].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawns[i].pos.x + 1,
                    spawns[i].pos.y,
                    { align: 'left', opacity: 0.8 });
            }
            return false
        }
    },
    attackBank(creep,target_bank) {

        // console.log(creep);
        let { bank } = creep.memory
        let { id } = bank
        let { pos } = bank
        let targetRoomName = pos.roomName
        // console.log("hello");
        if (!goToTargetRoom(creep, targetRoomName)) return
        let target = Game.getObjectById(id)
        if (!target) {
            let { powerBanks } =Game.rooms[creep.memory.roomName].memory
            for (let i = 0; i < powerBanks.length; i++) {
                if (id == powerBanks[i].id) {
                    powerBanks.splice(i,1)
                }
            }
            // console.log(creep);
            creep.suicide()
        }
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {

            creep.moveTo(target);
            creep.say("🛴赶路咯")
        }
        console.log(target.hits);
        if(target.hits<600*500) target_bank.finish= 1 
        console.log(target_bank.id+target_bank.finish);

    },
    healAttacker(creep) {
        let { bank } = creep.memory
        let { id } = bank
        let { pos } = bank
        let targetRoomName = pos.roomName
        let attackRole = creep.memory.roomName + "attackBank" + id
        let attackCreep = _.filter(Game.creeps, (creep) => creep.memory.role == attackRole);
        if (attackCreep.length) {
            if (creep.heal(attackCreep[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(attackCreep[0]);
                creep.say("🛴赶路咯")
            }
        }
    }
};

module.exports = roleSpawnHarvester;
