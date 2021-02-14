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
        var room = Game.rooms['E43N55'];
        if (!room) {
            if (creep.ticksToLive < 100) {
                // var controller = new RoomPosition(41,27,'E42N54');
                // console.log(controller.room);
                //输出新名字
                // console.log(harvester_newname);
                var controller_newname = 'Controller' + Game.time;
                if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
                    Game.spawns['ZhangLin1'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], controller_newname,
                        { memory: { role: 'controller' } });
                }
            }
            var controll = new RoomPosition(24, 24, 'E43N55');
            creep.moveTo(controll, { visualizePathStyle: { stroke: '#ffaa00' } });

        }

        else {
            var controll = Game.rooms['E43N55'].controller;
            if (creep.reserveController(controll) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controll, { visualizePathStyle: { stroke: '#ffaa00' } });
            }



        }
        // var controller = room.controller;
        // // console.log(controller.room);
        // if(!controller.my){
        //     var controller_newname = 'Controller' + Game.time;
        //     //输出新名字
        //     // console.log(harvester_newname);
        //     if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
        //         Game.spawns['ZhangLin1'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], controller_newname,
        //             { memory: { role: 'controller' } });
        //     }
        //     if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffaa00' } });
        //     }
        // }

    }
};
module.exports = roleHarvester;