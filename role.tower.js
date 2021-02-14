/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} tower **/
    run: function (tower) {
        var closestHostile_creeps = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var my_hurted_screeps = tower.room.find(FIND_MY_CREEPS,{
            filter:(creep)=>(creep.hits<creep.hitsMax)
        });
        if (closestHostile_creeps) {
            tower.attack(closestHostile_creeps);
        }
        else {
            if(my_hurted_screeps.length){
                tower.heal(creep);
            }
            if (tower.store.energy>800 ) {
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
                        filter: (structure) => (structure.hits < structure.hitsMax) &&
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