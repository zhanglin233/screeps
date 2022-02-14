

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.con_harvester');
 * mod.thing == 'a thing'; // true
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */


/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
let utils = require("utils")
const { isMyRoom } = utils
const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {
    E43N51: { list: 1, amount: 0, size: { carry: 20, move: 10 } },
    E43N54: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E49N51: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E43N55: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E41N49: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E46N51: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    W12N55: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E39N41: { list: 2, amount: 0, size: { work: 0, carry: 20, move: 10 } },
    E51N49: { list: 2, amount: 1, size: { work: 0, carry: 20, move: 10 } },


};

var roleCon_Harvester = {
    main: function () {

        for (let room in rooms) {
            if (isMyRoom(room)) {
                let creep_role = room + 'con_harvester';
                let con_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creep_role);
                // creep完成任务
                if (con_harvesters.length) {
                    for (let creep of con_harvesters) {
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
                if (con_harvesters.length < rooms[room].amount) {
                    this.spawn(room)
                }
                // 新增任务

            }
        }
    },

    spawn(room) {
        let sizeArray = {}
        if (Game.rooms[room].energyCapacityAvailable >= 300&&Game.rooms[room].energyCapacityAvailable <= 550) {
            sizeArray = { work: 0, carry: 5, move: 1 }
        }
        if (Game.rooms[room].energyCapacityAvailable > 550&&Game.rooms[room].energyCapacityAvailable <= 800) {
            sizeArray = { work: 0, carry: 6, move: 3 }
        }
        else if (Game.rooms[room].energyCapacityAvailable > 800&&Game.rooms[room].energyCapacityAvailable < 1200) {
            sizeArray = { work: 0, carry: 8, move: 4 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 1200&&Game.rooms[room].energyCapacityAvailable < 1700) {
            sizeArray = { work: 0, carry: 14, move:7  }
        }
        else{
            sizeArray = { work: 0, carry: 20, move: 10 }

        }
        let creepRole = room + 'con_harvester';
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
        if (!creep.room.memory.containers) return
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
        }

        let containerIds = creep.room.memory.containers
        for (let i = 0; i < containerIds.length; i++) {
            let { conId } = containerIds[i]
            let { type } = containerIds[i]
            let container = Game.getObjectById(conId)
            if(!container)continue
            if (container.store.getFreeCapacity() && type == "controller") {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }

    },
    getResource(creep, resource, amount) {
        let room = creep.room
        console.log(creep.store.getCapacity());
        if (!amount) amount = creep.store.getCapacity() - creep.store.getUsedCapacity()
        console.log("获取能量,amount = " + amount);
        let storage = room.storage
        let terminal = room.storage
        if (storage && storage.store[resource] > amount) {
            if (creep.withdraw(storage, resource, amount) == 0) creep.memory.status = 1
            else if (creep.withdraw(storage, resource, amount) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say("🛴赶路咯")
            }
        }
        else if (terminal && terminal.store[resource] > amount) {
            if (creep.withdraw(terminal, resource, amount) == 0) creep.memory.status = 1
            else if (creep.withdraw(terminal, resource, amount) == ERR_NOT_IN_RANGE) {
                creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say("🛴赶路咯")
            }
        }
        else if (room.controller.level < 5) {
            let containers = room.memory.containers
            for (let i = 0; i < containers.length; i++) {
                let { conId } = containers[i]
                let { type } = containers[i]
                let container = Game.getObjectById(conId)
                if(!container) continue
                if (container.store[RESOURCE_ENERGY] && type == "source") {
                    if (creep.withdraw(container, resource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                        creep.say("🛴赶路咯")
                    }
                }
            }

        }
        else {
            console.log("房间" + creep.room.name + "中的" + resource + "资源不够");
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1
        }

    },
};
module.exports = roleCon_Harvester;