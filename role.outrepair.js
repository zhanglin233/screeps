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
        var container1 = Game.getObjectById('602516e6d512ce68bd7f493d');
        var container2 = Game.getObjectById('60251b8ebbef76cce9c42e97');
        if (creep.room.name != 'E43N55') {
            creep.moveTo(container1);
        }
        else {
            if (container1.hits < container1.hitsMax) {
                if (creep.withdraw(container1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container1);
                }
                creep.repair(container1);
            }
            else if (container2.hits < container2.hitsMax) {
                if (creep.withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container2);
                }
                creep.repair(container2);
            }

        }
    }
};

module.exports = roleHarvester;