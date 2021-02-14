

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.con_harvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

};/*
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
            var container3 = Game.getObjectById('600e93a1fd4aa864a8911121');
            var storage = Game.getObjectById('601ea90031c5a7371bd57f64');
            var link = Game.getObjectById('6020d4e1c2002d2ed13bdbfa');

            var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 30, 33);
            // var storage = Game.getObjectById('60115f592ddff5ed12499ed8'); 
            
                if (creep.withdraw(container3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container3, { visualizePathStyle: { stroke: '#ffaa00' } });
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
                    return (structure.id == '600eab0247ffcecab31aa5d3') &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else{
                if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;