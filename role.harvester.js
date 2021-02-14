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
            var container2 = Game.getObjectById('600e8df2d5b8a114a8b85bd5');
            var container3 = Game.getObjectById('600e93a1fd4aa864a8911121');
            var tomstone = creep.room.find(FIND_TOMBSTONES);
            var resources = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (resource) => {
                    return resource.amount>150&&resource.resourceType==RESOURCE_ENERGY ;
                }
            });
            if (resources.length) {
                if (creep.pickup(resources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else {
                // if (container3.store[RESOURCE_ENERGY]-container2.store[RESOURCE_ENERGY] > 800) {
                //     if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(container2, { visualizePathStyle: { stroke: '#ffaa00' } });
                //     }
                // }
                // else{
                    if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container2, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
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
            if (targets.length < 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                    var send_link = Game.getObjectById('6020d4e1c2002d2ed13bdbfa');
                    if (creep.transfer(send_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(send_link, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                
            }
        }
    }
};

module.exports = roleHarvester;
