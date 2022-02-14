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

// const RESOURCE_KEANIUM_BAR = 'resource_keanium_bar';
// const RESOURCE_MIST = 'resource_mist';
// const RESOURCE_ENERGY = 'resource_energy';
// const RESOURCE_CONDENSATE = 'resource_condensate';

var rooms = ['E43N54', 'E43N55','E46N51', 'E49N51', 'E41N49', 'W12N55']

var transport = {
    main: function () {
        for (var room of rooms) {
            if (!Memory.taskTransport) {
                Memory.taskTransport = {}
            }
            else {
                if (!Memory.taskTransport[room]) {
                    Memory.taskTransport[room] = {}
                }
            }
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        var creeprole = room + 'core_harvester';
        // var product = rooms[room].product;
        var core_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (core_harvesters.length) {
            this.run(core_harvesters[0], room)
        }
    },

    run: function (creep, room) {
        if (JSON.stringify(Memory.taskTransport[room]) != "{}") {
            var factory = Game.rooms[room].factory
            var storage = Game.rooms[room].storage
            var terminal = Game.rooms[room].terminal
            let sourceType = Memory.taskTransport[room].sourceType
            let amount = Memory.taskTransport[room].amount
            let targetRoom = Memory.taskTransport[room].targetRoom
            let type = Memory.taskTransport[room].type
            let fee = Game.market.calcTransactionCost(amount, room, targetRoom)
            // console.log(fee);
            // console.log(targetRoom);
            // console.log(sourceType==RESOURCE_SILICON);
            var links = factory.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })
            if (links[0].store[RESOURCE_ENERGY] == 0 && creep.memory.withdrawEnergy == 0) {
                console.log(1);
                if (creep.memory.status == 0) {
                    console.log(2);
                    if (sourceType != 'energy') {
                        console.log('transport1');

                        console.log(3);
                        if (terminal.store[RESOURCE_ENERGY] < fee) {
                            console.log(4);
                            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage)
                                creep.memory.transport = 1
                            }


                        }
                        else {
                            console.log('transport2');
                            console.log(sourceType);
                            console.log(terminal.store['oxidant']);
                            console.log(terminal.store[sourceType] + '     ' + amount);
                            creep.memory.transport = 0
                            // console.log(5);
                            if (terminal.store[sourceType] < amount) {
                                // console.log(6);
                                console.log('transport');

                                if (creep.withdraw(storage, sourceType) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(storage)
                                }
                            }
                            else {
                                console.log(7+terminal.send(sourceType, amount, targetRoom));
                                console.log(sourceType, amount, targetRoom);
                                
                                if (type == 'transport') {
                                    if (terminal.send(sourceType, amount, targetRoom) == 0) {
                                        Memory.taskTransport[room] = {}
                                    }
                                }else{
                                    Memory.taskTransport[room] = {}
                                }
                            }
                        }
                    }
                    else {
                        if (terminal.store[RESOURCE_ENERGY] < fee + amount) {
                            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage)
                            }
                        }
                        else {
                            if (type == 'transport') {
                                if (terminal.send(sourceType, amount, targetRoom) == 0) {
                                    Memory.taskTransport[room] = {}
                                }
                            }else{
                                Memory.taskTransport[room] = {}
                            }
                        }
                    }
                    if (creep.store.getUsedCapacity() != 0) {
                        creep.memory.status = 1
                    }
                }
                else {
                    // console.log(Object.keys(creep.store)[0]);
                    if (creep.store.getUsedCapacity() == 0) {
                        creep.memory.status = 0
                    }
                    if (creep.transfer(terminal, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal)
                    }
                }
            }
        }

    },


};

module.exports = transport;