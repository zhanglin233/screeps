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
        if (creep.name == 'Harvester1') {
            sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(30, 33);
            // var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 30, 33);
            // var resource2 = creep.room.lookForAt(LOOK_RESOURCES, 31, 33);
            // var resource3 = creep.room.lookForAt(LOOK_RESOURCES, 31, 32);

            // if (resource1.length) {
            //     creep.pickup(resource1);
            // }


            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo((30,33), { visualizePathStyle: { stroke: '#ffaa00' } });
            }

            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
        }
        else if (creep.name == 'Harvester2') {
            creep.moveTo(41, 18);
            var resource4 = creep.room.lookForAt(LOOK_RESOURCES, 41, 18);
            var resource5 = creep.room.lookForAt(LOOK_RESOURCES, 41, 19);
            sources = creep.room.find(FIND_SOURCES);

            // console.log(resource4);
            // console.log(resource5);
            // if (resource4.length) {
            //     creep.pickup(resource4);
            // }
            // else if (resource5.length) {
            //     creep.pickup(resource5);
            // }
            // else {
            //     if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            //     }
            // }
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo((41,18), { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            // var sources = creep.room.find(FIND_SOURCES);
            //     if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            //     }
        }
    }
};

module.exports = roleHarvester;