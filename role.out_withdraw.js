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
            var container1 = Game.getObjectById('602516e6d512ce68bd7f493d');
            var container2 = Game.getObjectById('60251b8ebbef76cce9c42e97');
            if (creep.room.name != 'E43N55') {
                creep.moveTo(container1);
            }
            else {
                if (container1.store[RESOURCE_ENERGY] > 700) {
                    if (creep.withdraw(container1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container1);
                    }
                }
                else {
                    if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container2);
                    }
                }

            }
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.status = 1;
            }
        }


        else {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.status = 0;
            }
            else {
                var link = Game.getObjectById('60254670f1ec2aa88d9fd7e0');
                if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, { visualizePathStyle: { stroke: '#ffffff' } })
                }
                // var storage = Game.getObjectById('601ea90031c5a7371bd57f64');
                // if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } })
                // }
            }
            
            // if (creep.ticksToLive < 1400) {
            //     creep.moveTo(30, 22);
            //     Game.spawns['ZhangLin1'].renewCreep(creep);
            // }

        }
    }
};

module.exports = roleHarvester;