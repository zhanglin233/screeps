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
        creep.moveTo(29, 7);
        if (creep.memory.status == 0) {
            var accept_link = Game.getObjectById('601fd5e5d512ce67e87d83fd');
            var storage = Game.getObjectById('601ea90031c5a7371bd57f64');
            var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 29, 7);
            var resource2 = creep.room.lookForAt(LOOK_RESOURCES, 30, 6);
            if (resource1.length) {
                if (creep.pickup(resource1[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource1[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else if (resource2.length) {
                if (creep.pickup(resource2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource2[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else if (creep.withdraw(accept_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(accept_link, { visualizePathStyle: { stroke: '#ffaa00' } });
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
                var storage = Game.getObjectById('601ea90031c5a7371bd57f64');
                var terminal = Game.getObjectById('601fc829f7632d2b4586066e');
                // if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                // }
                if(storage.store[RESOURCE_ENERGY]<600000){
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                else{
                    if (creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                
                if (terminal.store[RESOURCE_ENERGY] > 200000) {
                    terminal.send(RESOURCE_ENERGY, 100000, 'E43N51');
                }
            }
        }
    }
};

module.exports = roleHarvester;
// 60225e885c01356bec27edf7
// Game.market.deal('60225e885c01356bec27edf7', 300, "E43N54");