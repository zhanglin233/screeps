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
        if (creep.name == 'E43N51_1') {
            sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(42,37);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else if (creep.name == 'E43N51_2') {
            creep.moveTo(35, 11);
            sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            // var sources = creep.room.find(FIND_SOURCES);
            //     if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            //     }
        }
    }
};

module.exports = roleHarvester;