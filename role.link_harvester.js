/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

const { capitalize } = require("lodash");



/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {
    E43N51: { list: 1, amount: 0, size: { carry: 5, move: 3 } },
    E43N54: { list: 2, amount: 0, size: { carry: 5, move: 3 } }
};

var roleLinkHarvester = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room]&&Game.rooms[room].controller.my) {
                this.Creep(room);
            }
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'link_harvester';
        var name = creeprole + Game.time;
        // console.log(name)
        // var screep_size = [];
        var size = new Array();
        for (var key in rooms[room].size) {
            for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (spawn_harvesters.length) {
            for (var creep of spawn_harvesters) {
                if (creep.room.name == 'E43N54') {
                    this.E43N54(creep);
                }
                else if (creep.room.name == 'E43N51') {
                    this.E43N51(creep);
                }
            }
        }

        // console.log(spawn_harvesters.length <= rooms[room].amount);
        if (spawn_harvesters.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name,
                    { memory: { role: creeprole ,roomname:room} }, { dryRun: true })==0) {
                    //如果spawn正在孵化creep，
                    // Game.spawns['Spawn1'].spawning.name获取正在孵化的creep的名字
                    //用名字获取creep
                    var spawningCreep = Game.creeps[spawns[i].spawning.name]
                    // 在名为Spawn1的房间内显示文本
                    //Game.spawns['Spawn1'].room.visual.text的参数为文本内容，x坐标,y坐标,输出文本的格式
                    spawns[i].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        spawns[i].pos.x + 1,
                        spawns[i].pos.y,
                        { align: 'left', opacity: 0.8 });
                }


            }
        }
    },
    E43N54: function (creep) {

    },
    E43N51: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 send');
        }

        if (creep.memory.building) {
            var sent_link = Game.getObjectById('60211c381ce3465c3f35af6e');
            var accept_link = Game.getObjectById('60200c5ecb5e2650f188e86f');

            if (creep.transfer(sent_link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sent_link);
            }
        }
        else {
            creep.moveTo(41, 37, { visualizePathStyle: { stroke: '#ffaa00' } });
            var container = Game.getObjectById('603374b72bb0cc606a7c9d8d');
            var resource1 = creep.room.lookForAt(LOOK_RESOURCES, 41, 37);
            var resource2 = creep.room.lookForAt(LOOK_RESOURCES, 42, 37);
            if (container.store[RESOURCE_ENERGY] > 250) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(41, 37, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }

        }
    }
};
module.exports = roleLinkHarvester;