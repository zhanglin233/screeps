/*
 * @Author: zhanglin 
 * @Date: 2022-02-09 19:28:52 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-11 17:22:06
 */
let utils = require("utils")
const { isMyRoom } = utils
const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {
    E43N51: { list: 1, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E43N54: { list: 2, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E49N51: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E43N55: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E41N49: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E46N51: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    W12N55: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E39N41: { list: 3, amount: 0, size: { work: 15, carry: 6, move: 8 } },
    E51N49: { list: 3, amount: 2, size: { work: 15, carry: 6, move: 8 } },

};

var roleUpgrader = {
    main: function () {
        for (let room in rooms) {
            if (isMyRoom(room)) {
                let creep_role = room + 'upgrader';
                let upgrades = _.filter(Game.creeps, (creep) => creep.memory.role == creep_role);
                // creep完成任务
                if (upgrades.length) {

                    for (let creep of upgrades) {
                    // if(creep.room.name!="E51N49") creep.suicide()

                        // creep.suicide()
                        if (!creep.memory.status) this.getResource(creep, RESOURCE_ENERGY)
                        else this.working(creep)
                        if (creep.ticksToLive < 130 && creep.memory.replace == 0) {
                            this.spawn(room)
                            creep.memory.replace = 1
                            break
                        }
                    }
                }
                if(Game.rooms[room].controller.level==8&&Game.rooms[room].controller.ticksToDowngrade<150000) rooms[room].amount=1
                // 孵化creep
                if (upgrades.length < rooms[room].amount) {
                    this.spawn(room)
                }
                // 新增任务

            }
        }
    },
    spawn(room) {
        let sizeArray = {}
        if (Game.rooms[room].energyCapacityAvailable >= 300&&Game.rooms[room].energyCapacityAvailable < 550) {
            sizeArray = { work: 0, carry: 5, move: 1 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 550&&Game.rooms[room].energyCapacityAvailable < 800) {
            sizeArray = { work: 3, carry: 2, move: 2 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 800&&Game.rooms[room].energyCapacityAvailable < 1500) {
            sizeArray = { work: 5, carry: 3, move: 3 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 1500) {
            sizeArray = { work: 8, carry: 4, move: 6}
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 2500) {
            sizeArray = { work: 15, carry: 5, move: 10 }
        }
        
        let creepRole = room + 'upgrader';
        let name = creepRole + Game.time;
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
                { memory: { role: creepRole, roomName: room, replace: 0 } })
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
    working(creep) {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
    getResource(creep, resource, amount) {
        if (!creep.room.memory.containers) return
        let room = creep.room
        // console.log(creep.store.getCapacity());
        if (!amount) amount = creep.store.getCapacity() - creep.store.getUsedCapacity()
        // console.log("获取能量,amount = " + amount);
        let containerIds = room.memory.containers
        for (let i = 0; i < containerIds.length; i++) {
            let { conId } = containerIds[i]
            let { type } = containerIds[i]
            let container = Game.getObjectById(conId)
            if(!container) continue
            if (container.store[RESOURCE_ENERGY] && type == "controller") {
                if (creep.withdraw(container, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                    creep.say("🛴赶路咯")
                }
            }
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1
        }

    },
};

module.exports = roleUpgrader;