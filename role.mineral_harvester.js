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
 * let mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

const { capitalize } = require("lodash");



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
    // // E43N51: { list: 1, amount: 0, size: { work: 20, carry: 12, move: 16 } },
    // E43N54: { list: 2, amount: 0, size: { work: 20, carry: 12, move: 16 } },
    // // E49N51: { list: 2, amount: 0, size: { work: 20, carry: 12, move: 16 } },
    // E43N55: { list: 2, amount: 0, size: { work: 20, carry: 12, move: 16 } },
    // E46N51: { list: 2, amount: 0, size: { work: 20, carry: 12, move: 16 } },
};

let roleMineralHarvester = {
    main: function () {
        for (let room in rooms) {
            if (Game.rooms[room]&&Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        let creeprole = room + 'mineral_harvester';
        let name = creeprole + Game.time;
        // console.log(name)
        // let screep_size = [];
        let size = new Array();
        for (let key in rooms[room].size) {
            for (let keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
            }
        }
        if (!Memory.mineral) {
            Memory.mineral = {}
           
        }
        else {
        
            if (!Memory.mineral[room]) {
                Memory.mineral[room] = {}
                
            }
            else {
                if (JSON.stringify(Memory.mineral[room]) == "{}") {
                    let mineral = Game.rooms[room].find(FIND_MINERALS)[0];
                    Memory.mineral[room].id = mineral.id
                    Memory.mineral[room].mineralType = mineral.mineralType
                    if (mineral.amount == 0 && mineral.ticksToRegeneration > 100) {
                        rooms[room].amount = 0
                    }
                    else {
                        rooms[room].amount = 1
                    }
                }
                else {
                    if (Game.time % 5) {
                        // console.log(rooms[room].amount)
                        let mineral = Game.getObjectById(Memory.mineral[room].id)
                        if (mineral.mineralAmount > 0 || mineral.ticksToRegeneration < 100) {
                            rooms[room].amount = 1

                        }
                        else {
                            rooms[room].amount = 0
                        }
                    }
                    let mineral_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
                    if (mineral_harvesters.length) {
                        let mineral = Game.getObjectById(Memory.mineral[room].id)
                        for (let creep of mineral_harvesters) {
                            this.run(creep, room, mineral)
                        }
                    }



                    if (mineral_harvesters.length < rooms[room].amount) {
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
            }


        }
    },
    run: function (creep, room, mineral) {
        let type = mineral.mineralType;
        if (creep.memory.status == 0) {
            if (mineral) {
                if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }

            // }
            if (creep.store[type] == creep.store.getCapacity()) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.store[type] == 0) {
                creep.memory.status = 0;
            }
            if (Memory.storage[room]) {
                let storage = Game.getObjectById(Memory.storage[room])
                if (storage) {
                    if (creep.transfer(storage, type) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    else if (creep.transfer(storage, type) == ERR_FULL) {
                        if (Memory.terminal[room]) {
                            let terminal = Game.getObjectById(Memory.terminal[room])
                            if (creep.transfer(terminal, type) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffffff' } });
                            }
                        }
                        else {
                            let terminal = Game.rooms[room].find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_TERMINAL;
                                }
                            });
                            Memory.terminal[room] = terminal.id
                        }
                    }
                }
            }
            else {
                let storage = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_STORAGE;
                    }
                });
                if (storage.length) {
                    Memory.storage[room] = storage[0].id
                    if (creep.transfer(storage[0], type) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    else if (creep.transfer(storage[0], type) == ERR_FULL) {
                        if (Memory.terminal[room]) {
                            let terminal = Game.getObjectById(Memory.terminal[room])
                            if (creep.transfer(terminal, type) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffffff' } });
                            }
                        }
                        else {
                            let terminal = Game.rooms[room].find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_TERMINAL;
                                }
                            });
                            if (terminal.length) {
                                Memory.terminal[room] = terminal[0].id
                            }
                        }
                    }
                }

            }


        }
    },
};
module.exports = roleMineralHarvester;


