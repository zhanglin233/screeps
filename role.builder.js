/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

const { merge } = require("lodash");

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            room1 = Game.rooms['E43N54'];
            room2 = Game.rooms['E43N55'];
            var targets1 = room1.find(FIND_CONSTRUCTION_SITES);
            if (room2) {
                var targets2 = Game.rooms['E43N55'].find(FIND_CONSTRUCTION_SITES);
                // targets1 = targets1.push.apply(targets1, targets2);
                targets1 = this.merge_dicts(targets1,targets2);
            }

            if (targets1.length) {
                if (creep.build(targets1[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets1[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        else {
            var container2 = Game.getObjectById('600e8df2d5b8a114a8b85bd5');
            var storage = Game.getObjectById('601ea90031c5a7371bd57f64');

            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
            }

        }
    },

    merge_dicts: function(dict1,dict2){
        for(var i=0;i<dict2.length;i++){
            dict1[dict1.length+i] = dict2[i];
        }

        return dict1;
    }


};

module.exports = roleBuilder;



