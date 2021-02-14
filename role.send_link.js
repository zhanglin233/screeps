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
            var send_link1 = Game.getObjectById('6020d4e1c2002d2ed13bdbfa');
            var send_link2 = Game.getObjectById('60254670f1ec2aa88d9fd7e0');
            var accept_link = Game.getObjectById('601fd5e5d512ce67e87d83fd');
            if(send_link1.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                send_link1.transferEnergy(accept_link);
            }
            if(send_link2.store.getFreeCapacity(RESOURCE_ENERGY)==0){
                send_link2.transferEnergy(accept_link);
            }
    }
};

module.exports = roleHarvester;
