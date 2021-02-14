/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if(creep.ticksToLive<800){
        //     creep.moveTo(Game.spawns['ZhangLin1']);
        //     Game.spawns['ZhangLin1'].renewCreep(creep);
        //     Game.spawns['ZhangLin1'].renewCreep(creep);
        //     Game.spawns['ZhangLin1'].renewCreep(creep);
        // }
        if (creep.memory.status == 0) {
            var container = Game.getObjectById('601e620ce3fa34b7f5765e47');
            var resource1 = creep.room.lookAt(RESOURCE_ENERGY,13,7);
            var resource2 = creep.room.lookAt(RESOURCE_ENERGY,13,8);
            var resource3 = creep.room.lookAt(RESOURCE_ENERGY,13,9);
            if (resource1.length) {
                    if (creep.pickup(resource1[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
            }
            else if(resource2){
                if (creep.pickup(resource2[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource2[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else if(resource3){
                if (creep.pickup(resource3[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource3[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            if (creep.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.status = 1;
            }
        } else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;