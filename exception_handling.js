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
        var myrooms = Game.rooms;
        for(var room in myrooms){
            console.log(room.name);
        }
// vvdsfs
};

module.exports = roleHarvester;