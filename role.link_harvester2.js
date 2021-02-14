/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

const { capitalize } = require("lodash");

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 send');
        }

        if (creep.memory.building) {
            var sent_link = Game.getObjectById('60211c381ce3465c3f35af6e');
            var accept_link = Game.getObjectById('60200c5ecb5e2650f188e86f');

            if (creep.transfer(sent_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sent_link);
            }
        }
        else {
            var container = Game.getObjectById('601e3b3fbb78d1bb3b1a9bfa');
            var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 41, 37);
            var resource2 = creep.room.lookForAt(LOOK_RESOURCES, 42, 37);
            if(resource1.length){
                
            }
            if (Game.creeps['E43N51_1']) {
                if (Game.creeps['E43N51_1'].pos.isEqualTo(42, 37)) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                else {
                    creep.moveTo(41, 37);
                }
            }



        }
    }
};

module.exports = roleBuilder;