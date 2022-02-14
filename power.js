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
    E43N51: { list: 1, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E39N41: { list: 1, amount: 0, size: { work: 0, carry: 20, move: 10 } },
    E46N51: { list: 2, amount: 0, size: { carry: 20, move: 10 } },
    E49N51: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    // E43N55: { list: 2, amount: 1, size: { carry: 4, move: 2 } },
    E41N49: { list: 2, amount: 1, size: { carry: 20, move:10 } },
};
let roleHarvester = {
    main: function () {

        if (!Memory.powerspawns) {
            Memory.powerspawns = {}
        }
        for (let room in rooms) {
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                var size = new Array();

                var creeprole = room + 'powerEnergyTransfer';
                let name = creeprole + Game.time;
                let targetrooms = room
                // console.log(targetrooms);
                for (let key in rooms[room].size) {
                    for (let keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                        size.push(key);
                        // console.log(size)
                    }
                }
                var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
                if (spawn_harvesters.length < rooms[room].amount) {
                    var spawns = Game.rooms[room].spawn
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

                let powerspawn = Game.rooms[room].powerSpawn
                if (powerspawn) {
                    var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
                    if (spawn_harvesters.length) {
                        for (var creep of spawn_harvesters) {
                            this.run(creep, room, powerspawn)
                        }
                    }
                }

            }


        }
    },
    run: function (creep, room, powerspawn) {
        if (powerspawn.store[RESOURCE_ENERGY] >= 50 && powerspawn.store[RESOURCE_POWER] > 0) {
            powerspawn.processPower()
        }
        let storage = Game.rooms[room].storage
        let terminal = Game.rooms[room].terminal
        if (storage) {
            if (creep.memory.status == 0) {
                if (powerspawn.store[RESOURCE_ENERGY] < 2500) {
                    if (terminal.store[RESOURCE_ENERGY] > 0) {
                        if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal)
                        }
                    }
                    else{
                        if (storage.store[RESOURCE_ENERGY] > 50000) {
                            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage)
                            }
                        }
                    }
                }
                else if (powerspawn.store[RESOURCE_POWER] < 50) {
                    if (creep.withdraw(storage, RESOURCE_POWER, 50) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage)
                    }
                    if (creep.withdraw(storage, RESOURCE_POWER, 50) == -6) {
                       if (creep.withdraw(terminal, RESOURCE_POWER, 50) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal)
                    } 
                    }
                }
                if (creep.store.getUsedCapacity() > 0) {
                    creep.memory.status = 1
                }

            }

            else {
                if (creep.store.getUsedCapacity() == 0) {
                    creep.memory.status = 0
                }
                // if(creep.transfer(terminal,RESOURCE_POWER)==ERR_NOT_IN_RANGE||creep.transfer(terminal,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                //     creep.moveTo(terminal)
                // }  
                if (creep.transfer(powerspawn, RESOURCE_POWER) == ERR_NOT_IN_RANGE || creep.transfer(powerspawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(powerspawn)
                }

            }
        }
    }
};

module.exports = roleHarvester;