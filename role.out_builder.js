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
        
                if (creep.withdraw(sources1,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources1, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.status = 1;
                }
            // }

        }


        else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.id == '600eab0247ffcecab31aa5d3') &&
            //             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //     }
            // });
            // if (targets.length > 0) {
            //     if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            //     }
            // }


        }
    }
};

module.exports = roleHarvester;