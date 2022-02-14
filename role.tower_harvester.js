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
 * var mod = require('role.harvester');
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

const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {
    E43N51: { list: 1, amount: 0, size: { carry: 10, move: 5 } },
    E43N54: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E49N51: { list: 1, amount: 0, size: { carry: 6, move: 3 } },
    E43N55: { list: 1, amount: 0, size: { carry: 6, move: 3 } },
    E41N49: { list: 1, amount: 0, size: { carry: 6, move: 3 } },
    E46N51: { list: 1, amount: 0, size: { carry: 6, move: 3 } },
    W12N55: { list: 1, amount: 0, size: { carry: 6, move: 3 } },
};

var roleTowerHarvester = {
    main: function () {
        for (var room in rooms) {
            // console.log(room);
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'tower_harvester';
        var creeprole2 = room + 'spawn_harvester';
        var name = creeprole + Game.time;
        let size = new Array();
        for (let key in rooms[room].size) {
            for (let keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
            }
        }
        // console.log(name)
        // var screep_size = [];
        if (!Memory.storage) {
            Memory.storage = {}
        }

        else {
            if (!Memory.storage[room]) {
                let storage = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if (storage.length) {
                    Memory.storage[room] = storage[0].id
                }
            }
            let tower_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
            // console.log(room + tower_harvesters.length);
            if (tower_harvesters.length) {
                for (var creep of tower_harvesters) {
                    this.run(creep, room)
                }
            }
            if (tower_harvesters.length < rooms[room].amount) {
                let spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
                });

                for (let i = 0; i < spawns.length; i++) {
                    spawns[i].spawnCreep(size, name,
                        { memory: { role: creeprole, roomname: room } })
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
        }
    },

    run: function (creep, room, storage) {
        if (creep.memory.status == 0) {
            if (Memory.storage[room]&&Game.rooms[room].storage.store[RESOURCE_ENERGY]>0) {
                var storage = Game.getObjectById(Memory.storage[room])

                if (storage) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
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
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.status = 0;
            }
            var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 150;
                }
            });
            if (targets) {
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    },
};

module.exports = roleTowerHarvester;


