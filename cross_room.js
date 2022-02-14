/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var crossRoom = {
    main: function (creep, target) {
        if (!creep.memory.target && !creep.memory.movestatus) {
            creep.memory.target = target
        }
        else {
            // console.log('creep.pos ==creep.memory.target[0]   '+creep.pos ==creep.memory.target[0]);
            if (JSON.stringify(creep.pos) == JSON.stringify(creep.memory.target[0])) {
                creep.memory.target.splice(0, 1)
                if (!creep.memory.target) {
                    creep.memory.movestatus = 1
                }
            }
        }
        // console.log(creep.memory.target[0]);
        creep.moveTo(creep.memory.target[0])
    }
}
module.exports = crossRoom.main;

