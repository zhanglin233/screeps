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
        var container1 = Game.getObjectById('60291f623f89d25e731db025');
        var container2 = Game.getObjectById('60290dfa575b6c25a9b06900');
        var out_repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_repair');
        var road = Game.getObjectById('602911868307600af12b734d');
        if (creep.room.name != 'E43N55') {
            creep.moveTo(container1);
        }

        else {
            for (var i = 0; i < out_repair.length; i++) {
                if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.building = false;
                    creep.say('🔄 harvest');
                }
                if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                    creep.memory.building = true;
                    creep.say('🚧 build');
                }
                if (creep.memory.building) {
                    if (i % 2 == 0) {
                        if (container1.hits < container1.hitsMax) {
                            out_repair[i].repair(container1);
                        }
                        else if (road.hits < road.hitsMax) {
                            out_repair[i].repair(road);
                        }
                    }
                    else {
                        out_repair[i].moveTo(25, 34);
                        if (container2.hits < container2.hitsMax) {
                            out_repair[i].repair(container2);
                        }
                    }

                }
                else {
                    if (i % 2 == 0) {
                        if (out_repair[i].withdraw(container1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_repair[i].moveTo(container1);
                        }
                    }
                    else {
                        if (out_repair[i].withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_repair[i].moveTo(container2);
                        }
                    }
                }
            }

        }
    }
};

module.exports = roleHarvester;