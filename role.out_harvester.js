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
            var source1 = Game.getObjectById('5bbcaf7e9099fc012e63aaae');
            var source2 = Game.getObjectById('5bbcaf7e9099fc012e63aaac');
            if (creep.room.name != 'E43N55') {
                creep.moveTo(source1);
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.name=='outHarvester1'){
                    creep.moveTo(26,33)
                    if(creep.harvest(source1)==ERR_NOT_IN_RANGE){
                        creep.moveTo(source1);
                    }
                }
                else{
                    creep.moveTo(36,17);
                    if(creep.harvest(source2)==ERR_NOT_IN_RANGE){
                        creep.moveTo(source2);
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
            // if (creep.ticksToLive < 1400) {
            //     creep.moveTo(30, 22);
            //     Game.spawns['ZhangLin1'].renewCreep(creep);
            // }
            else {
                var storage = Game.getObjectById('601ea90031c5a7371bd57f64');
                var link = Game.getObjectById('60254670f1ec2aa88d9fd7e0');
                if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link, { visualizePathStyle: { stroke: '#ffffff' } })
                }
            }
        }
    }
};

module.exports = roleHarvester;