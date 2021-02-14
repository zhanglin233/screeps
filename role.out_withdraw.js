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
        var out_withdraw = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_withdraw');
        for (var i = 0; i < out_withdraw.length; i++) {
            creep = out_withdraw[i];
            if (creep.memory.status == 0) {
                if (creep.room.name != 'E43N55') {
                    creep.moveTo(container1);
                }
                else {
                    if (i % 2 == 1) {
                        console.log(out_withdraw[i]);
                        if (out_withdraw[i].withdraw(container1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_withdraw[i].moveTo(container1);
                        }
                    }
                    else {
                        if (out_withdraw[i].withdraw(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_withdraw[i].moveTo(container2);
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
                    if (i % 2 == 1) {
                        if (out_withdraw[i].transfer(container2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_withdraw[i].moveTo(container2);
                        }
                    }
                    else {
                        if (out_withdraw[i].transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            out_withdraw[i].moveTo(link);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;