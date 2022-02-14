/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var rooms = ['E43N51', 'E43N54', 'E49N51', 'E43N55', 'E41N49', 'E46N51', 'W12N55','E39N41',"E51N49"];
var roleHarvester = {
    main: function () {
        for (var room of rooms) {
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                if(!Game.rooms[room].memory.beAttacked&&Game.time%5) continue
                var Hostile_creeps = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
                var my_hurted_screeps = Game.rooms[room].find(FIND_MY_CREEPS, {
                    filter: (creep) => (creep.hits < creep.hitsMax)
                });
                if (Hostile_creeps.length) {
                    Game.rooms[room].memory.beAttacked = 1
                    var towers = Game.rooms[room].find(FIND_STRUCTURES,
                        {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_TOWER
                            }
                        });
                    for (var tower of towers) {
                        var closestHostile_creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        tower.attack(closestHostile_creep)
                    }
                }
                else {
                    Game.rooms[room].memory.beAttacked = 0

                    if (my_hurted_screeps.length) {
                        var towers = Game.rooms[room].find(FIND_STRUCTURES,
                            {
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_TOWER
                                }
                            });
                        for (var tower of towers) {
                            tower.heal(my_hurted_screeps[0]);
                        }
                    }
                    else {
                        var closestHostile_structres = Game.rooms[room].find(FIND_HOSTILE_STRUCTURES);
                        if (closestHostile_structres) {
                            var towers = Game.rooms[room].find(FIND_STRUCTURES,
                                {
                                    filter: (structure) => {
                                        return structure.structureType == STRUCTURE_TOWER
                                    }
                                });
                            for (var tower of towers) {
                                tower.attack(closestHostile_structres);
                            }
                        }
                        var closestDamagedwall = Game.rooms[room].find(FIND_STRUCTURES, {
                            filter: (structure) => (structure.hits < 1000) &&
                                (structure.structureType == STRUCTURE_WALL ||
                                    structure.structureType == STRUCTURE_RAMPART)
                        });
                        if (closestDamagedwall.length) {
                            var towers = Game.rooms[room].find(FIND_STRUCTURES,
                                {
                                    filter: (structure) => {
                                        return structure.structureType == STRUCTURE_TOWER
                                    }
                                });
                            for (var tower of towers) {
                                tower.repair(closestDamagedwall[0]);
                            }
                        }
                        else {
                            var closestDamagedStructure = Game.rooms[room].find(FIND_STRUCTURES, {
                                filter: (structure) => (structure.hits < structure.hitsMax / 2) &&
                                    (structure.structureType == STRUCTURE_ROAD ||
                                        structure.structureType == STRUCTURE_CONTAINER)
                            });
                            if (closestDamagedStructure.length) {
                                var towers = Game.rooms[room].find(FIND_STRUCTURES,
                                    {
                                        filter: (structure) => {
                                            return structure.structureType == STRUCTURE_TOWER
                                        }
                                    });
                                for (var tower of towers) {
                                    tower.repair(closestDamagedStructure[0]);
                                }
                            }

                        }
                    }
                }
            }

        }
    },
    /** @param {Creep} tower **/
    run: function (tower) {
        var closestHostile_creeps = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var my_hurted_screeps = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => (creep.hits < creep.hitsMax)
        });
        if (closestHostile_creeps) {
            tower.attack(closestHostile_creeps);
        }
        else {
            if (my_hurted_screeps.length) {
                tower.heal(my_hurted_screeps[0]);
            }
            if (tower.store.energy > 800) {
                var closestHostile_structres = tower.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if (closestHostile_structres) {
                    tower.attack(closestHostile_structres);
                }
                var closestDamagedwall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => (structure.hits < 1000) &&
                        (structure.structureType == STRUCTURE_WALL ||
                            structure.structureType == STRUCTURE_RAMPART)
                });
                if (closestDamagedwall) {
                    tower.repair(closestDamagedwall);
                }
                else {
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => (structure.hits < structure.hitsMax / 2) &&
                            (structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_CONTAINER)
                    });
                    if (closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }

                    else {
                        var closestDamagedwall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => (structure.hits < 20000) &&
                                (structure.structureType == STRUCTURE_WALL ||
                                    structure.structureType == STRUCTURE_RAMPART)
                        });
                        if (closestDamagedwall) {
                            tower.repair(closestDamagedwall);
                        }
                        else {
                            var closestDamagedwall = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => (structure.hits < 1000000) &&
                                    (
                                        structure.structureType == STRUCTURE_RAMPART)
                            });
                            if (closestDamagedwall) {
                                tower.repair(closestDamagedwall);
                            }
                        }
                    }
                }
            }


        }
    }
};

module.exports = roleHarvester;