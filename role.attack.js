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
        var room = Game.rooms['E43N55'];
        if (room) {
            var Hostile_creeps = room.find(FIND_HOSTILE_CREEPS);
            ATTACK_NAME = 'attack' + Game.time;
            if (Hostile_creeps.length&&!Memory.ATTACKstatus) {
                Game.spawns['ZhangLin1'].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK, ATTACK, ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, MOVE, MOVE, MOVE], ATTACK_NAME,
                    { memory: { role: 'attack' } });
            }
            var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack');
            if (attackers.length&&Hostile_creeps.length) {
                for(var attacker of  attackers){
                    // attacker = Game.creeps[name];
                    console.log(attacker);
                    if (attacker.attack(Hostile_creeps[0]) == ERR_NOT_IN_RANGE) {
                        attacker.moveTo(Hostile_creeps[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                
            }
        }

    }

};

module.exports = roleHarvester;