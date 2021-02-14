/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.status == 0) {
            var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 30, 33);
            var tomstone = creep.room.lookForAt(Tombstone, 12, 18);
            var resource2 = creep.room.lookForAt(LOOK_RESOURCES, 31, 33);
            var resource3 = creep.room.lookForAt(LOOK_RESOURCES, 31, 32);

            if (tomstone.length) {
                if (creep.withdraw(resource1[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (creep.withdraw(resource1[0],RESOURCE_GHODIUM_OXIDE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (creep.withdraw(resource1[0],RESOURCE_KEANIUM_OXIDE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (creep.withdraw(resource1[0],RESOURCE_ZYNTHIUM_HYDRIDE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (creep.withdraw(resource1[0],RESOURCE_UTRIUM_HYDRIDE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            if (resource1.length) {
                if (creep.pickup(resource1[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else if (resource2.length) {
                if (creep.pickup(resource2[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource2[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else if (resource3.length) {
                if (creep.pickup(resource3[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource3[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else {
                if (container2.store.energy > 400) {
                    if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container2, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container2, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                else {
                    //     if (container3.store.energy<400) {
                    //     if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    //         creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
                    //     }
                    //     // if (creep.withdraw(container3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //     //     creep.moveTo(container3, { visualizePathStyle: { stroke: '#ffaa00' } });
                    //     // }
                    //     // }
                    //     // else {
                    //     //         // creep.moveTo(container3, { visualizePathStyle: { stroke: '#ffaa00' } });
                    //     //         if (creep.withdraw(container3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //     //                 creep.moveTo(container3, { visualizePathStyle: { stroke: '#ffaa00' } });
                    //     //             }
                    //     // }
                    // }
                    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                // var sources = creep.room.find(FIND_SOURCES);
                // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                // }
            }
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                var container5 = Game.getObjectById('601a2585863988246d282db9');
                if (creep.transfer(container5, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container5, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            // else{
            //     var targets2 = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (structure.id == '600eab0247ffcecab31aa5d3') &&
            //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //         }
            //     });
            //     if (targets2.length > 0) {
            //         if (creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(targets2[0], { visualizePathStyle: { stroke: '#ffffff' } });
            //         }
            //     }
            // }
        }
    }
};

module.exports = roleHarvester;
