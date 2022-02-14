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
    // E49N51: { list: 3, amount: 1, size: { tough: 0, heal: 0, move: 8, claim: 2 } }
    W12N55: { list: 3, amount: 0, size: { tough: 0, heal: 0, move: 8, claim: 2 } }

};

var rolecontroller = {
    main: function () {
        for (var room in rooms) {
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                this.spawn(room)
                this.Creep();
            }
            else {
                this.Creep2();
            }
        }

    },

    spawn: function (room) {
        // console.log('helloword');
        var creepRole = 'controller';
        var name = creepRole;
        var size = new Array();
        var controller = _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);

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
                spawns[i].spawnCreep(size, name,
                    { memory: { role: creepRole, roomname: room } })
                if (spawns[i].spawning) {
                    var spawningCreep = Game.creeps[spawns[i].spawning.name];
                    spawns[i].room.visual.text(
                        '🛠️' + spawningCreep.memory.role,
                        spawns[i].pos.x + 1,
                        spawns[i].pos.y,
                        { align: 'left', opacity: 0.8 });
                }
            }


        }
    },
    Creep: function () {
        var creepRole = 'controller';
        var name = creepRole;
        var creep = Game.creeps[name]
        // console.log(name)
        // var screep_size = [];
        if (creep) {
            creep.memory.role = creepRole
            this.run(creep, 'W12N51')
        }
    },
    run: function (creep, targetroom) {
        var room = Game.rooms[targetroom];
        if (room) {
            var controll = room.controller;
            if (controll.ticksToDowngrade < 500 || !controll.my) {
                creep.moveTo(controll, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.claimController(controll);
            }
        }
        else {
            var target = [new RoomPosition(11, 48, 'W11N55'),new RoomPosition(48, 26, 'W11N53'),new RoomPosition(7, 8, 'W10N51'),new RoomPosition(7, 8, 'W12N51')]
            cross_room(creep, target)
        }
    },
    Creep2: function () {
        var creepRole = 'controller';
        var name = creepRole;
        var creep = Game.creeps[name]
        // console.log(name)
        // var screep_size = [];
        if (creep) {
            creep.memory.role = creepRole
            this.run2(creep, 'E39N41')
        }
    },
    run2: function (creep, targetroom) {
        var room = Game.rooms[targetroom];
        if (room) {
            var controll = room.controller;
            if (controll.ticksToDowngrade < 500 || !controll.my) {
                creep.moveTo(controll, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.claimController(controll);
            }
        }
        else {
            var target = [new RoomPosition(1, 16, 'E39N41')]
            cross_room(creep, target)
        }
    },
};
module.exports = rolecontroller;
