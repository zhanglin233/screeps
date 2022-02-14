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
    E43N51: { list: 1, amount: 0, size: { work: 10, carry: 10, move: 10 } },
    E43N54: { list: 2, amount: 0, size: { work: 10, carry: 10, move: 10 } },
    E49N51: { list: 2, amount: 0, size: { work: 8, carry: 4, move: 6 } },
    E43N55: { list: 2, amount: 0, size: { work: 10, carry: 10, move: 10 } },
    E41N49: { list: 2, amount: 0, size: { work: 10, carry: 10, move: 10 } },
    E46N51: { list: 2, amount: 0, size: { work: 8, carry: 4, move: 6 } },
    W12N55: { list: 2, amount: 0, size: { work: 5, carry: 5, move: 5 } },
    E39N41: { list: 2, amount: 0, size: { work: 5, carry: 5, move: 5 } },
    E51N49: { list: 2, amount: 0, size: { work: 5, carry: 5, move: 5 } },

    

};

var roleBuilder = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room]&&Game.rooms[room].controller.my) {
                this.Creep(room);

            }
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'builder';
        var name = creeprole + Game.time;
        if (Game.time % 50) {
            var CONSTRUCTION_SITES = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
            if (CONSTRUCTION_SITES.length) {
                var toatlprogress = 0;
                for (var i = 0; i < CONSTRUCTION_SITES.length; i++) {
                    toatlprogress = toatlprogress + (CONSTRUCTION_SITES[i].progressTotal - CONSTRUCTION_SITES[i].progress);
                }
                if (toatlprogress > 100000) {
                    rooms[room].amount = 2;
                }
                else if (toatlprogress > 50000) {
                    rooms[room].amount = 1;
                }
                else if (toatlprogress > 0) {
                    rooms[room].amount = 1;
                }
                else if (toatlprogress == 0) {
                    rooms[room].amount = 0;
                }
            }
            else {
                rooms[room].amount = 0;
            }
        }

        var size = new Array();
        if (Game.rooms[room].energyCapacityAvailable >= 800&&Game.rooms[room].energyCapacityAvailable <1300) {
            rooms[room].size = { work: 5, carry: 2, move: 4 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >=1300) {
            rooms[room].size = { work: 6, carry: 6, move: 6 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 2500) {
            rooms[room].size = { work: 6, carry: 6, move: 6 }
        }
        else {
            rooms[room].size = { work: 15, carry: 10, move: 25 }
        }
        for (var key in rooms[room].size) {
            for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        // console.log('hello' + spawn_harvesters.length);
        if (spawn_harvesters.length) {
            for (var creep of spawn_harvesters) {
                this.run(creep, room)
            }
        }
        // console.log(rooms[room].amount);
        // console.log(spawn_harvesters.length <= rooms[room].amount);
        if (spawn_harvesters.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                let spawns = Game.rooms[room].spawn

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
    run: function (creep, room) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }

        }
        else {
            let storage = Game.rooms[room].storage
            let terminal = Game.rooms[room].terminal
            if (storage) {

                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                }

            }
            else if(terminal){
                if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                }   
            }
            else {
                var drop_sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return (resource.resourceType == RESOURCE_ENERGY && resource.amount > 300)
                    }
                })
                if (drop_sources) {
                    if (creep.pickup(drop_sources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(drop_sources)
                    }
                }
            }
        }
    }

};
module.exports = roleBuilder;



