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
            var powerbank = new RoomPosition(9, 9, 'E43N50');
            if (creep.room.name != 'E43N50') {
                creep.moveTo(powerbank);
            }
            else {
                if (creep.room.name == 'E43N50') {
                    sources1 = Game.getObjectById('6024af92f65bc19eb51ae34d');
                    if (sources1.c ) {
                        if (creep.harvest(sources1) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources1, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                    // else {
                    //     var mineral2 = new RoomPosition(16, 44, 'E40N56');
                    //     creep.moveTo(mineral2, { visualizePathStyle: { stroke: '#ffaa00' } });
                    // }
                }
                // else {
                //     if (creep.room.name == 'E40N56') {
                //         sources2 = Game.getObjectById('602134f57990179eba69d31f');
                //         if (sources2.cooldown <= 20) {
                //             if (creep.harvest(sources2) == ERR_NOT_IN_RANGE) {
                //                 creep.moveTo(sources2, { visualizePathStyle: { stroke: '#ffaa00' } });
                //             }
                //         }
                //         else {
                //             var mineral1 = new RoomPosition(35, 9, 'E40N55');
                //             creep.moveTo(mineral1, { visualizePathStyle: { stroke: '#ffaa00' } });
                //         }
                //     }
                // }
            }
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.status = 1;
            }

        }

        else {
            if (creep.ticksToLive < 1490) {
                CREEP_SPAWN_TIME.moveTo(33, 21);
                Game.spawns['Spawn2'].renewCreep(creep);
            } else {
                var storage = Game.getObjectById('6020c71acb5e26aba489259c');
                if (creep.transfer(storage, RESOURCE_MIST) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } })
                }
            }
            if (creep.store[RESOURCE_MIST] == 0) {
                creep.memory.status = 0;
            }

        }
    }
};

module.exports = roleHarvester;