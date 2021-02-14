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
    run: function () {
            var send_link = Game.getObjectById('60211c381ce3465c3f35af6e');
            var accept_link = Game.getObjectById('60200c5ecb5e2650f188e86f');
            if(send_link.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                send_link.transferEnergy(accept_link);
            }
    }
};

module.exports = roleHarvester;
