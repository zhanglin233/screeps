/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

let pcs = []

let roleHarvester = {
    main: function () {
        if (Game.shard.name == 'shard3') {
            pcs = ['factory', 'factory_1', 'factory_2','factory_3']
        }


        if (Game.powerCreeps['factory'].usePower(PWR_REGEN_SOURCE, Game.getObjectById('5bbcaf7f9099fc012e63aabd')) == ERR_NOT_IN_RANGE) {
            Game.powerCreeps['factory'].moveTo(Game.getObjectById('5bbcaf7f9099fc012e63aabd'))
        }
        for (let pc_name of pcs) {
            let pc = Game.powerCreeps[pc_name]

            if (pc.room) {
                let roomName = pc.room.name
                let powerSpawn = Game.rooms[roomName].powerSpawn
                let factory = Game.rooms[roomName].factory
                let storage = Game.rooms[roomName].storage
                let terminal = Game.rooms[roomName].terminal

                if (!pc.room.controller.isPowerEnabled) {
                    if (pc.enableRoom(pc.room.controller) == ERR_NOT_IN_RANGE) {
                        pc.moveTo(pc.room.controller)
                    }
                }
                else {
                    pc.usePower(PWR_GENERATE_OPS)

                    if (pc.ticksToLive < 100) {
                        if (pc.renew(powerSpawn) == ERR_NOT_IN_RANGE) {
                            pc.moveTo(powerSpawn);
                        }
                    }
                    else {
                        if (pc.level > 10) {
                            room_sources = Memory.sources[roomName]
                            for (var room_source in room_sources) {
                                var source = Game.getObjectById(room_source)
                                if (!source.effects || !source.effects.length) {
                                    console.log(source);
                                    pc.moveTo(source)
                                    if (pc.usePower(PWR_REGEN_SOURCE, source) == ERR_NOT_IN_RANGE) {
                                        pc.moveTo(source)
                                    }
                                }
                                else {
                                    if (source.effects && source.effects.length && source.effects[0].ticksRemaining < 100) {
                                        console.log(source);
                                        pc.moveTo(source)
                                        if (pc.usePower(PWR_REGEN_SOURCE, source) == ERR_NOT_IN_RANGE) {
                                            pc.moveTo(source)
                                        }
                                    }
                                    else {
                                        if (pc.usePower(PWR_OPERATE_STORAGE, storage) == ERR_NOT_IN_RANGE) {
                                            pc.moveTo(storage)
                                        }
                                        if (pc.usePower(PWR_OPERATE_STORAGE, storage) == ERR_NOT_ENOUGH_RESOURCES) {
                                            if(terminal.store[RESOURCE_OPS]!=0){
                                                if(pc.withdraw(terminal, RESOURCE_OPS,500)==ERR_NOT_IN_RANGE){
                                                    pc.moveTo(terminal)
                                                }
                                            }
                                            
                                        }
                                        if (pc.store.getFreeCapacity() == 0) {
                                            if (pc.transfer(storage, RESOURCE_OPS) == ERR_NOT_IN_RANGE) {
                                                pc.moveTo(storage)
                                            }

                                        }
                                    }
                                }
                            }

                        }
                        else{
                            if (pc.usePower(PWR_OPERATE_STORAGE, storage) == ERR_NOT_IN_RANGE) {
                                pc.moveTo(storage)
                            }
                            if (pc.usePower(PWR_OPERATE_STORAGE, storage) == ERR_NOT_ENOUGH_RESOURCES) {
                                if(terminal.store[RESOURCE_OPS]!=0){
                                    if(pc.withdraw(terminal, RESOURCE_OPS,400)==ERR_NOT_IN_RANGE){
                                        pc.moveTo(terminal)
                                    }
                                }
                                
                            }
                            if (pc.store.getFreeCapacity() == 0) {
                                if (pc.transfer(storage, RESOURCE_OPS) == ERR_NOT_IN_RANGE) {
                                    pc.moveTo(storage)
                                }

                            }
                        }
                        
                    }
                }

            }
        }
    }
};

module.exports = roleHarvester;


