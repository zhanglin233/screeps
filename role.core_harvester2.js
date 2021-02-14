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
        creep.moveTo(31,20);
        if (creep.memory.status == 0) {
            var accept_link = Game.getObjectById('60200c5ecb5e2650f188e86f');
            var terminal = Game.getObjectById('60269ec926db10c4f407d1d1');
            if(accept_link.store[RESOURCE_ENERGY]!=0){
                if (creep.withdraw(accept_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(accept_link, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            
            else{
                if(terminal.store[RESOURCE_ENERGY]>50000){
                    if (creep.withdraw(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
            } 
        }

            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.status = 1;
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.status = 0;
            }
            else {
                var storage = Game.getObjectById('6020c71acb5e26aba489259c');
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleHarvester;
