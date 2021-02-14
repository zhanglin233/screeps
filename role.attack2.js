/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} tower **/
    run: function () {
        var room = Game.rooms['E43N51'];
        if (room) {
            var Hostile_creeps = room.find(FIND_HOSTILE_CREEPS);
            ATTACK2_NAME = 'attack2' + Game.time;
            if (Hostile_creeps.length && !Memory.ATTACK2status) {
                Game.spawns['Spawn2'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE], ATTACK_NAME,
                    { memory: { role: 'attack2' } });
                // Game.spawns['Spawn2'].spawnCreep([TOUGH], ATTACK2_NAME,
                //     { memory: { role: 'attack2' } });
            }
            var attacker2s = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack2');
            if (attacker2s.length && Hostile_creeps.length) {
                for (var attacker2 of attacker2s) {
                    // attacker = Game.creeps[name];
                    console.log(attacker2);
                    if (attacker2.attack(Hostile_creeps[0]) == ERR_NOT_IN_RANGE) {
                        attacker.moveTo(Hostile_creeps[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        }

    }

};

module.exports = roleHarvester;