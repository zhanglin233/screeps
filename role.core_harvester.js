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
    E43N51: { list: 1, amount: 1, size: { carry: 15, move: 8 } },
    E43N54: { list: 2, amount: 1, size: { carry: 15, move: 8 } },
    E49N51: { list: 2, amount: 1, size: { carry: 15, move: 5 } },
    E43N55: { list: 2, amount: 1, size: { carry: 15, move: 5 } },
    E41N49: { list: 2, amount: 1, size: { carry: 15, move: 5 } },
    E46N51: { list: 2, amount: 1, size: { carry: 15, move: 5 } },
    W12N55: { list: 2, amount: 1, size: { carry: 15, move: 5 } },
    E39N41: { list: 2, amount: 1, size: { carry: 15, move: 5 } }

};

var roleCoreHarvester = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room]&&Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'core_harvester';
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
                var storage = Game.rooms[room].storage
                var terminal = Game.rooms[room].terminal
                // console.log(room + creep + creep.ticksToLive);
                if (room == 'E39N41') {
                    this.run(creep, storage, terminal)
                }
                else if (room == 'E41N49'||room == 'E43N51'||room == 'E49N51') {
                    this.run3(room,creep, storage, terminal)
                }
                else {
                    this.run(creep, storage, terminal)
                }
            }
        }
        if (spawn_harvesters.length && rooms[room].amount > 0) {
            for (var creep of spawn_harvesters) {
                if (creep.ticksToLive < 80 && creep.memory.replace == 0) {
                    var spawns = Game.rooms[room].spawn
                    if (spawns.length) {
                        for (var i = 0; i < spawns.length; i++) {
                            spawns[i].spawnCreep(size, name,
                                { memory: { role: creeprole, roomname: room, withdrawEnergy:0,replace: 0 } })
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
                    { memory: { role: creeprole, roomname: room, withdrawEnergy: 0, replace: 0 } })
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

    run: function (creep, storage, terminal) {
        if(creep.ticksToLive<10&&creep.memory.status==0&&creep.memory.withdrawEnergy==0){
            creep.suicide()
        }
        if(typeof(creep.memory.withdrawEnergy)=='undefined'){
            creep.memory.withdrawEnergy=0
        }
        if (creep.memory.withdrawEnergy == 0) {
            var links = terminal.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })

            if (links[0].store[RESOURCE_ENERGY] != 0) {
                if (creep.withdraw(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(links[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                creep.memory.withdrawEnergy = 1
            }
        }
        else if (creep.memory.withdrawEnergy == 1) {
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.withdrawEnergy = 0
            }
            else {
                console.log(Object.keys(creep.store)[0]);
                if (storage.store[RESOURCE_ENERGY] <storage.store.getCapacity()*0.75) {
                    if (creep.transfer(storage,Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                else {
                    if (creep.transfer(terminal, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }

            }
        }
    },

    run3: function (room,creep, storage, terminal) {
        if(creep.ticksToLive<10&&creep.memory.status==0&&creep.memory.withdrawEnergy==0){
            creep.suicide()
        }
        if(typeof(creep.memory.withdrawEnergy)=='undefined'){
            creep.memory.withdrawEnergy=0
        }
        if (creep.memory.withdrawEnergy == 0) {
            var links = terminal.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })

            if (links[0].store[RESOURCE_ENERGY] != 0) {
                if (creep.withdraw(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(links[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                creep.memory.withdrawEnergy = 1
            }
            // else{
            //     if (terminal.store[RESOURCE_ENERGY] != 0&&(room=="E49N51"||room=="E41N49")) {
            //         if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
            //         }
            //         creep.memory.withdrawEnergy = 1
            //     }
            // }
        }
        else if (creep.memory.withdrawEnergy == 1) {
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.withdrawEnergy = 0
            }
            else {
                var links = terminal.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                })
    
               
                    if (storage.store[RESOURCE_ENERGY] < storage.store.getCapacity()*0.80) {
                        if (creep.transfer(storage,Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                    else{
                       
                        if (creep.transfer(terminal,Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    
                    }
                
                // console.log(Object.keys(creep.store)[0]);
                
                // else {
                //     if (creep.transfer(terminal, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                //     }
                // }

            }
        }
    },
    run2: function (creep, storage, terminal) {
        if(creep.ticksToLive<10&&creep.memory.status==0&&creep.memory.withdrawEnergy==0){
            creep.suicide()
        }
        if(typeof(creep.memory.withdrawEnergy)=='undefined'){
            creep.memory.withdrawEnergy=0
        }
        if (creep.memory.withdrawEnergy == 0) {
            var links = storage.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })

            if (links[0].store[RESOURCE_ENERGY] != 0) {
                if (creep.withdraw(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(links[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                creep.memory.withdrawEnergy = 1
            }
        }
        else if (creep.memory.withdrawEnergy == 1) {
            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.withdrawEnergy = 0
            }
            else {
                if (storage.store[RESOURCE_ENERGY] < 900000) {
                    if (creep.transfer(storage, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                else {
                    if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }

            }
        }
    },

};
module.exports = roleCoreHarvester;
// 60225e885c01356bec27edf7
// Game.market.deal('60225e885c01356bec27edf7', 300, "E43N54");


// Game.market.createOrder({
//     type: ORDER_BUY,
//     resourceType: RESOURCE_ENERGY,
//     price: 1.600,
//     totalAmount: 2000000,
//     roomName: "E49N51"   
// });