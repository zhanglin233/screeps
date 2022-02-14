/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

let rooms = {
    // E43N51: { list: 1, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E43N54: { list: 2, amount: 0, size: { work: 0, carry: 20, move: 10 } },
    E49N51: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E43N55: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E41N49: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E46N51: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    W12N55: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E39N41: { list: 2, amount: 0, size: { carry: 20, move: 10 } },


};

let roleSpawnHarvester = {
    main: function () {
        for (let room in rooms) {
            // console.log(room);
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        let creeprole = room + 'spawn_harvester';
        let name = creeprole + Game.time;
        // console.log(name)
        // let screep_size = [];
        var size = new Array();
        // if (Game.rooms[room].energyCapacityAvailable >= 550 && Game.rooms[room].energyCapacityAvailable <= 850) {
        //     rooms[room].size = { carry: 4, move: 2 }
        // }
        // else if (Game.rooms[room].energyCapacityAvailable > 850 && Game.rooms[room].energyCapacityAvailable < 1300) {
        //     rooms[room].size = { carry: 8, move: 4 }
        // }
        // else if (Game.rooms[room].energyCapacityAvailable < 2000) {
        //     rooms[room].size = { carry: 10, move: 5 }
        // }
        // else {
        //     rooms[room].size = { carry: 20, move: 10 }
        // }
        for (let key in rooms[room].size) {
            for (let keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
      
        
        let spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (spawn_harvesters.length) {

            for (var creep of spawn_harvesters) {
                creep.suicide()
                this.run(creep, room)
            }
        }
        if (spawn_harvesters.length < rooms[room].amount) {
            let spawns = Game.rooms[room].spawn

            for (let i = 0; i < spawns.length; i++) {
                spawns[i].spawnCreep(size, name,
                    { memory: { role: creeprole, roomname: room} })
                if(spawns[i].spawnCreep(size, name,
                    { memory: { role: creeprole, roomname: room} })==ERR_NOT_ENOUGH_ENERGY){
                        size = [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE]
                        spawns[i].spawnCreep(size, name,
                            { memory: { role: creeprole, roomname: room} })
                    }
                if (spawns[i].spawning) {
                    var spawningCreep = Game.creeps[spawns[i].spawning.name];
                    spawns[i].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        spawns[i].pos.x + 1,
                        spawns[i].pos.y,
                        { align: 'left', opacity: 0.8 });
                }


            }
        }
    },
    run: function (creep, room) {
        if (creep.memory.status == 0) {
            if (Game.rooms[room].storage&&Game.rooms[room].storage&&Game.rooms[room].storage.store[RESOURCE_ENERGY]>0) {
                var storage = Game.rooms[room].storage
                var storage = Game.rooms[room].storage
                if (storage) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
            else{
                if (Game.rooms[room].terminal&&Game.rooms[room].terminal&&Game.rooms[room].terminal.store[RESOURCE_ENERGY]>0) {
                    var terminal = Game.rooms[room].terminal
                    if (terminal) {

                        if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                }
                else {
                    var drop_sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => {
                            return (resource.resourceType == RESOURCE_ENERGY)
                        }
                    })
                    if (drop_sources) {
                        if (creep.pickup(drop_sources) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(drop_sources)
                        }
                    }
                }
            }
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.status = 0;
            }
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else{
                var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 250;
                    }
                });
                if (tower) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        }
    },
   
};

module.exports = roleSpawnHarvester;
