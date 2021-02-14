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
            var mineral = Game.getObjectById('5bbcb674d867df5e54207879');
            // var mineral_resource = creep.room.find(FIND_DROPPED_RESOURCES);
            var mineral_resources = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (mineral_resource) => {
                    return (mineral_resource.resourceType == RESOURCE_ZYNTHIUM);
                }
            });
            if (mineral_resources.length) {
                if (creep.pickup(mineral_resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral_resources[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                if (mineral) {
                    if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(mineral, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
            if (creep.store[RESOURCE_ZYNTHIUM]==creep.store.getCapacity()) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.store[RESOURCE_ZYNTHIUM] == 0) {
                creep.memory.status = 0;
            }
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.id == '6020c71acb5e26aba489259c') &&
                        structure.store.getFreeCapacity(RESOURCE_ZYNTHIUM) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ZYNTHIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
                
            }

        }
    }
};

module.exports = roleHarvester;