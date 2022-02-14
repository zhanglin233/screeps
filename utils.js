/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* let mod = require('role.controller');
* mod.thing == 'a thing'; // true
*/

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

let utils = {
    /**
     * 判断room是否为我控制的房间
     * @param {要判断的房间名} roomName
     * @returns 
     */
    isMyRoom: function (roomName) {
        if (Game.rooms[roomName] && Game.rooms[roomName].controller.my) {
            return true;
        }
        return false;
    },
    crossRoom(creep, target) {
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
    },
    /**
     * 将房间room的source的id存入memory,操作成功返回true
     * @param {*} room 
     */
    keepSourceId(targetRoom) {
        if (!Memory.sources[targetRoom]) {
            Memory.sources[targetRoom] = {}
        }
        else {
            if (JSON.stringify(Memory.sources[targetRoom]) == "{}") {
                let sources = Game.rooms[targetRoom].find(FIND_SOURCES);
                if (sources.length) {
                    for (let source of sources) {
                        if (!Memory.sources[targetRoom][source.id]) {
                            Memory.sources[targetRoom][source.id] = 0
                        }
                    }
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return true
            }
        }
    },
    /**
     * 检查爬是否抵达目标房间,抵达返回true,为抵达便前往目标房间并返回false
     * @param {指定的工作的爬} creep 
     * @param {目标房间名} targetRoomName 
     */
    goToTargetRoom(creep, targetRoomName) {
        if (creep.room.name != targetRoomName) {
            let position = new RoomPosition(25, 25, targetRoomName)
            creep.moveTo(position)
            return false
        }
        return true
    },
    
}

global.utils = utils;
module.exports = utils;