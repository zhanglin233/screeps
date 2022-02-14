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
 * var mod = require('role.con_harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

};/*
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

const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {
    E43N51: { list: 1, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E43N54: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E49N51: { list: 2, amount: 2, size: { work: 20, carry: 8, move: 14 } },
    E43N55: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E41N49: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E46N51: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    W12N55: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E39N41: { list: 2, amount: 2, size: { work: 15, carry: 6, move: 8 } },
    E51N49: { list: 2, amount: 2, size: { work: 6, carry: 0, move: 3 } },
};

var roleCon_Harvester = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        if (!Memory.sources) {
            Memory.sources = {}
        }
        for (let room in rooms) {
            let targetrooms = rooms[room]
            // console.log(targetrooms);
            if (!Memory.sources) {
                Memory.sources = {}
            }

            else {
                if (!Memory.sources[room]) {
                    Memory.sources[room] = {}
                }
                else {
                    if (JSON.stringify(Memory.sources[room]) == "{}" && Game.rooms[room] && Game.rooms[room].controller.my) {
                        let sources = Game.rooms[room].find(FIND_SOURCES);
                        if (sources.length) {
                            for (var source of sources) {
                                if (!Memory.sources[room][source.id]) {
                                    Memory.sources[room][source.id] = 0
                                }
                            }
                        }
                    }
                }
            }
        }
        // console.log('helloword');
        var creeprole = room + 'container_creep';
        var name = creeprole + Game.time;
        // console.log(name)
        // var screep_size = [];
        var size = new Array();
        // if(Game.rooms[room].energyCapacityAvailable>=550&&Game.rooms[room].energyCapacityAvailable<800){
        //     rooms[room].size = { work: 5, carry: 1, move: 3 }
        // }
        // else if(Game.rooms[room].energyCapacityAvailable>=800&&Game.rooms[room].energyCapacityAvailable<=1800){
        //     rooms[room].size = { work: 6, carry: 0, move: 3 }
        // }
        // else if(Game.rooms[room].energyCapacityAvailable<2500){
        //     rooms[room].size = { work: 6, carry: 6, move: 6 }
        // }
        // else{
        //     rooms[room].size = { work: 8, carry: 6, move: 7 }
        // }
        for (var key in rooms[room].size) {
            for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (spawn_harvesters.length) {
            if (Game.rooms[room].controller.level < 5) {
                for (var creep of spawn_harvesters) {
                    this.run(room, creep)

                }
            }
            else {
                for (var creep of spawn_harvesters) {
                    // console.log(room+creep+creep.ticksToLive);
                    this.run(room, creep)
                }
            }

        }
        if (spawn_harvesters.length && rooms[room].amount > 0) {
            for (var creep of spawn_harvesters) {
                if (creep.ticksToLive < 130 && creep.memory.replace == 0) {
                    var spawns = Game.rooms[room].spawn
                    if (spawns.length) {
                        for (var i = 0; i < spawns.length; i++) {
                            spawns[i].spawnCreep(size, name,
                                { memory: { role: creeprole, roomname: room, replace: 0, releaseSource: 0 } })
                            if (spawns[i].spawning) {
                                var spawningCreep = Game.creeps[spawns[i].spawning.name];
                                spawns[i].room.visual.text(
                                    '🛠️' + spawningCreep.memory.role,
                                    spawns[i].pos.x + 1,
                                    spawns[i].pos.y,
                                    { align: 'left', opacity: 0.8 });
                                if (spawningCreep.memory.role == creeprole) {
                                    creep.memory.replace = 1
                                    break
                                }
                            }

                        }
                    }

                }
            }
        }
        // console.log(spawn_harvesters.length <= rooms[room].amount);
        if (spawn_harvesters.length < rooms[room].amount) {
            var spawns = Game.rooms[room].spawn

            for (var i = 0; i < spawns.length; i++) {
                spawns[i].spawnCreep(size, name,
                    { memory: { role: creeprole, roomname: room, replace: 0, releaseSource: 0 } })
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
    run: function (room, creep) {
        room_sources = Memory.sources[room]
        for (var room_source in room_sources) {
            if (Memory.sources[room][room_source] == 0 && !creep.memory.source_id) {
                Memory.sources[room][room_source] = 1
                creep.memory.source_id = room_source
                break
            }
            else if (Memory.sources[room][room_source] == 1) {
                if (creep.ticksToLive < 80 && creep.memory.source_id == room_source && creep.memory.releaseSource == 0) {
                    creep.memory.releaseSource = 1
                    Memory.sources[room][room_source] = 0
                }

            }
        }
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 send');
        }

        if (creep.memory.building) {
            if (!creep.memory.linkId) {
                var links = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                })
                if (links.length) {
                    creep.memory.linkId = links[0].id
                }
                else {
                    creep.drop(RESOURCE_ENERGY);
                }
            }
            else {
                creep.memory.dontPullMe = true;

                // let link = Game.getObjectById(creep.memory.linkId)
                var links = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                })
                if (links.length) {
                    if (creep.transfer(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(links[0]);
                    }
                }
            }

        }
        else {
            creep.memory.dontPullMe = true;

            if (creep.memory.source_id) {
                var source = Game.getObjectById(creep.memory.source_id)
                // if (creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(source);
                // }
                var source = Game.getObjectById(creep.memory.source_id)
                if (creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        }


    },
    run2: function (room, creep) {

        room_sources = Memory.sources[room]
        for (var room_source in room_sources) {
            if (Memory.sources[room][room_source] == 0 && !creep.memory.source_id) {
                Memory.sources[room][room_source] = 1
                creep.memory.source_id = room_source
                break
            }
            else if (Memory.sources[room][room_source] == 1) {
                if (creep.ticksToLive < 130 && creep.memory.source_id == room_source && creep.memory.releaseSource == 0) {
                    Memory.sources[room][room_source] = 0
                    // creep.memory.releaseSource==1
                }

            }
        }
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 send');
        }

        if (creep.memory.building) {
            var structres = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target < 0) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else if (structres.length) {
                var struct = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (creep.build(struct) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct);
                }
            }
        }
        else {
            if (creep.memory.source_id) {
                var source = Game.getObjectById(creep.memory.source_id)
                if (creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        }


    },

};
module.exports = roleCon_Harvester;