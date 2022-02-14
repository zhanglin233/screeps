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
    E43N51: { list: 1, amount: 0, size: { carry: 8, move: 4 } },
    E43N54: { list: 2, amount: 0, size: { carry: 8, move: 4 } },
    E49N51: { list: 3, amount: 0, size: { carry: 6, move: 3 } },
    E43N55: { list: 3, amount: 0, size: { carry: 6, move: 3 } },
    E41N49: { list: 3, amount: 0, size: { carry: 8, move: 4 } },
    W12N55: { list: 3, amount: 0, size: { carry: 8, move: 4 } },
    E39N41: { list: 3, amount: 0, size: { carry: 10, move: 5 } },
};

var roleHarvester = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room]&&Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'harvester';
        var name = creeprole + Game.time;
        // console.log(name)
        // var screep_size = [];
        var size = new Array();
        for (var key in rooms[room].size) {
            for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (spawn_harvesters.length) {
            for (var creep of spawn_harvesters) {
                this.run(creep,room)
            }
        }

        // console.log(spawn_harvesters.length <= rooms[room].amount);
        if (spawn_harvesters.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
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
    },
    E43N54: function (creep) {
        if (creep.memory.status == 0) {
            var container2 = Game.getObjectById('600e8df2d5b8a114a8b85bd5');
            var container3 = Game.getObjectById('600e93a1fd4aa864a8911121');
            var tomstone = creep.room.find(FIND_TOMBSTONES);
            var resources = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (resource) => {
                    return resource.amount > 150 && resource.resourceType == RESOURCE_ENERGY;
                }
            });
            if (resources.length) {
                if (creep.pickup(resources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_EXTENSION ||
            //             structure.structureType == STRUCTURE_SPAWN) &&
            //             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //     }
            // });
            var target = Game.getObjectById('600eab0247ffcecab31aa5d3');
            if (target.store.getFreeCapacity() > 0) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                var send_link = Game.getObjectById('603b0091bf07c523432de2db');
                if (creep.transfer(send_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(send_link, { visualizePathStyle: { stroke: '#ffffff' } });
                }

            }
        }
    },

    run: function (creep,room) {

        if (creep.memory.status == 0) {

             var drop_sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return (resource.resourceType == RESOURCE_ENERGY&&resource.amount>=300)
                    }
                })
                if (drop_sources) {
                    if (creep.pickup(drop_sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(drop_sources)
                    }
                }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }

            var storage = Game.rooms[room].storage
            if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
            }

        }
    }
};
module.exports = roleHarvester;
