/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('role.controller');
* mod.thing == 'a thing'; // true
*/

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
const RANGED_ATTACK = 'ranged_attack';
const HEAL = 'heal';
const TOUGH = 'tough';
const CLAIM = 'claim';
var cross_room = require('cross_room')


var rooms = {
    E41N49: { list: 3, amount: 0, size: { move: 16, carry: 32 } }
};

var rolecontroller = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.spawn(room)
                let sourceType = RESOURCE_PURIFIER
                this.Creep(room, sourceType);

            }
            else {
                this.Creep1();
            }
        }

    },

    spawn: function (room) {
        // console.log('helloword');
        let creepRole = 'reseller';
        let creepRole1 = 'reseller1';
        let creepRole2 = 'reseller2';
        var name = creepRole;
        var name1 = creepRole1;
        var name2 = creepRole2;
        var size = new Array();
        var controller = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller');
        var controller1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller1');
        var controller2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller2');

        for (var key in rooms[room].size) {
            for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        if (controller.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name,
                    { memory: { role: creepRole, roomname: room } }, { dryRun: true }) == 0) {
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
        if (controller1.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name1,
                    { memory: { role: creepRole1, roomname: room } }, { dryRun: true }) == 0) {
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
        if (controller2.length < rooms[room].amount) {
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name2,
                    { memory: { role: creepRole2, roomname: room } }, { dryRun: true }) == 0) {
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
    Creep: function (room, sourceType) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller');
        if (creeps.length) {
            for (let creep of creeps) {
                if (creep.memory.status == 0) {
                    var terminal = Game.rooms[room].terminal
                    // console.log(room);
                    if (terminal) {
                        if (creep.withdraw(terminal, sourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                    if (creep.store.getFreeCapacity() == 0) {
                        creep.memory.status = 1;
                    }
                }
                else {
                    if (creep.store[sourceType] == 0) {
                        creep.memory.status = 0;
                    }
                    this.run(creep, 'E39N41')
                }
            }
        }
        let creeps1 = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller1');
        if (creeps1.length) {
            for (let creep1 of creeps1) {
                if (creep1.memory.status == 0) {
                    var terminal = Game.rooms[room].terminal
                    // console.log(room);
                    if (terminal) {
                        if (creep1.withdraw(terminal, sourceType) == ERR_NOT_IN_RANGE) {
                            creep1.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                    if (creep1.store.getFreeCapacity() == 0) {
                        creep1.memory.status = 1;
                    }
                }
                else {
                    if (creep1.store[sourceType] == 0) {
                        creep1.memory.status = 0;
                    }
                    this.run(creep1, 'E39N41')
                }
            }
        }
        let creeps2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'reseller2');
        if (creeps2.length) {
            for (let creep2 of creeps2) {
                if (creep2.memory.status == 0) {
                    var terminal = Game.rooms[room].terminal
                    // console.log(room);
                    if (terminal) {
                        if (creep2.withdraw(terminal, sourceType) == ERR_NOT_IN_RANGE) {
                            creep2.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                    if (creep2.store.getFreeCapacity() == 0) {
                        creep2.memory.status = 1;
                    }
                }
                else {
                    if (creep2.store[sourceType] == 0) {
                        creep2.memory.status = 0;
                    }
                    this.run(creep2, 'E39N41')
                }
            }
        }

    },
    Creep1: function () {
        var creepRole = 'reseller'
        var name = 'reseller';
        var creep = Game.creeps[name]
        // console.log(name)
        // var screep_size = [];
        if (creep) {
            creep.memory.role = creepRole
            this.run(creep, 'E39N41')
        }
        var creepRole1 = 'reselle1'
        var name1 = 'reseller1';
        var creep1 = Game.creeps[name1]
        // console.log(name)
        // var screep_size = [];
        if (creep1) {
            creep1.memory.role = creepRole1
            this.run(creep1, 'E39N41')
        }
        var creepRole2 = 'reselle2'
        var name2 = 'reseller2';
        var creep2 = Game.creeps[name2]
        // console.log(name)
        // var screep_size = [];
        if (creep2) {
            creep2.memory.role = creepRole2
            this.run(creep2, 'E39N41')
        }
    },
    run: function (creep, targetroom) {
        var room = Game.rooms[targetroom];
        if (room) {
            let terminal = Game.rooms[targetroom].terminal
            if (creep.transfer(terminal, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(terminal);
            }
            if(creep.store[RESOURCE_PURIFIER]==0){
                creep.suicide()
            }
        }
        else {
            var target = [new RoomPosition(40, 38, 'E40N50'), new RoomPosition(1, 16, 'E39N41')]
            cross_room(creep, target)
        }
    },

};
module.exports = rolecontroller;
