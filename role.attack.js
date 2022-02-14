/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

const { filter } = require("lodash");


/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
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
const TOUGH = 'tough'
const CARRY = 'carry';
const ATTACK = 'attack';

var rooms = {  
    E43N51: { list: 1, amount: 0, size: { tough: 30, move: 15 } },
    E43N54: { list: 2, amount: 0, size: { tough:10,attack: 10, move: 20 } },
    E49N51: { list: 2, amount: 0, size: { work: 3, carry: 1, move: 2 } }
};

var roleAttack = {
    main: function () {
        
        for (var room in rooms) {
            this.Creep(room);
        }
    },

    Creep: function (room) {
        // console.log('helloword');
        var creeprole = room + 'attacker';
        var name = creeprole + Game.time;
        var spawn_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        // console.log('hello' + spawn_harvesters.length);
        if (spawn_harvesters.length) {
            for (var creep of spawn_harvesters) {
                if (creep.memory.roomname == 'E43N54') {
                    this.E43N54(creep);
                }
                else if (creep.memory.roomname == 'E43N51') {
                    this.E43N51(creep, 'E43N52');
                }
                else if (creep.memory.roomname == 'E43N55') {
                    this.E43N55(creep);
                }
            }
        }
        // console.log(rooms[room].amount);
        // console.log(spawn_harvesters.length <= rooms[room].amount);
        if (spawn_harvesters.length < rooms[room].amount) {
            var size = new Array();
            for (var key in rooms[room].size) {
                for (var keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                    size.push(key);
                    // console.log(size)
                }
            }
            var spawns = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            for (var i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name,
                    { memory: { role: creeprole, roomname: room } }, { dryRun: true }) == 0) {
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
        var room = Game.rooms['E44N53'];
        if (creep.room.name=='E44N53') {
            var Hostile_creeps = room.find(FIND_STRUCTURES,{
                filter:(structure)=>{
                    return structure.structureType == STRUCTURE_SPAWN
                }
            });
            // creep.moveTo(position)
            if (Hostile_creeps.length) {
                    if (creep.attack(Hostile_creeps[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Hostile_creeps[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
            }
        }
        else{
            var position = new RoomPosition(43,1,'E44N53')
            creep.moveTo(position)
        }

    },
    E43N51: function (creep, targetroom) {
        var room = Game.rooms[targetroom];
        var spawn = Game.rooms[targetroom].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == StructureSpawn ||
                    structure.structureType == StructureTower)
            }
        })
        if (spawn.length) {
            if (creep.attack(spawn[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn[0]);
            }
        }
    },
    E43N55: function (creep) {

    },
    run: function () {

    }
};
module.exports = roleAttack;




