/*
 * @Author: zhanglin 
 * @Date: 2022-02-09 16:56:40 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-10 19:33:09
 */
let utils = require('./utils')
let observe = require('./role.observe')
const { filter } = require('lodash')
let { deleteDeposit } = observe
let { isMyRoom } = utils
let { goToTargetRoom } = utils
const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

let rooms = {
    // E39N41: { list: 1, amount: 0, size: { work: 20, carry: 5, move: 25 }, },
    E43N51: { list: 1, amount: 0, size: { work: 20, carry: 5, move: 25 }, },
    E49N51: { list: 1, amount: 0, size: { work: 20, carry: 5, move: 25 }, },
    E41N49: { list: 1, amount: 0, size: { work: 20, carry: 5, move: 25 }, },
    E46N51: { list: 1, amount: 1, size: { work: 20, carry: 5, move: 25 }, },
};

let roleOut_Harvester = {
    main: function () {
        let amount = 1
        for (let roomName in rooms) {
            if (isMyRoom(roomName)) {
                let room = Game.rooms[roomName]
                // console.log(roomName+Game.rooms[roomName].memory.deposits.length);
                // console.log(Game.rooms[roomName].memory.deposits);
                // console.log(!Game.rooms[roomName].memory.deposits||Game.rooms[roomName].memory.deposits.length==0);
                if (!Game.rooms[roomName].memory.deposits || Game.rooms[roomName].memory.deposits.length == 0) continue
                let { deposits } = room.memory
                // console.log(deposits);
                for (let i = 0; i < deposits.length; i++) {
                    let deposit = deposits[i]
                    let { id } = deposit
                    let { pos } = deposit
                    let pos_x = pos.x
                    let pos_y = pos.y
                    let targetRoomName = pos.roomName
                    let position = new RoomPosition(pos_x, pos_y, targetRoomName)
                    let { depositType } = deposit
                    // 孵化工作的爬
                    let creepRole = roomName + "deposit" + id
                    let depositHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);
                    if (depositHarvesters.length) {
                        for (let creep of depositHarvesters) {
                            // creep.suicide()
                            if (creep.ticksToLive < 300 && creep.memory.replace == 0) {
                                deposit.work = 0
                                // console.log(deposit.work);
                                this.spawn(roomName, deposit, creepRole)
                                creep.memory.replace = 1
                                // console.log(creep.replace);
                            }
                            if (this.getDeposit(creep)) this.putDeposit(creep, room.storage)
                        }
                    }
                    if (depositHarvesters.length < amount) {
                        this.spawn(roomName, deposit, creepRole)
                    }
                }
            }
        }

        // console.log(out_harvester.length <= rooms[room].amount);
    },

    /**
     * 房间名为roomName的房间孵化挖取deposite的爬
     * @param {房间名,String} roomName 
     * @param {deposit对象} deposit 
     * @param {creep的role,String} creepRole 
     */
    spawn(roomName, deposit, creepRole) {
        sizeArray = { work: 20, carry: 5, move: 25 }
        let size = new Array();
        for (let key in sizeArray) {
            for (let keyLength = 0; keyLength < sizeArray[key]; keyLength++) {
                size.push(key);
                // console.log(size)
            }
        }
        if (!deposit.work) {
            let name = creepRole + Game.time
            let spawns = Game.rooms[roomName].spawn
            for (let i = 0; i < spawns.length; i++) {
                if (spawns[i].spawnCreep(size, name,
                    { memory: { role: creepRole, replace: 0, deposit: deposit, replace: 0 } }) == 0) deposit.work = 1
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
    getDeposit(creep) {
        let { deposit } = creep.memory
        let { id } = deposit
        let { pos } = deposit
        let targetRoomName = pos.roomName
        let { depositType } = deposit
        if (creep.memory.status == 0) {
            if (!goToTargetRoom(creep, targetRoomName)) return
            let source = Game.getObjectById(id)
            deposit.lastCooldown = source.lastCooldown
            let dropResource
            if (!Game.time % 5) {
                dropResource = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => {
                        return (resource.resourceType == depositType)
                    }
                })
            }
            if (!dropResource||!dropResource.length) {
                if (creep.harvest(source, depositType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                    creep.say("🛴赶路咯")
                }
                
            }
            else {
                if (creep.pickup(dropResource[0], depositType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropResource)[0];
                    creep.say("🛴赶路咯")
                }
            }
            if (creep.store.getFreeCapacity() == 0 || deposit.lastCooldown >= 100) {
                creep.memory.status = 1;
                return true
            }
            return false
        }
        return true
    },
    /**
     * creep将资源放到指定建筑物中
     * @param {*} creep 
     * @param {目标建筑物} target 
     */
    putDeposit(creep, target) {
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.status = 0;
            if (creep.memory.deposit.lastCooldown >= 100) {
                let id = creep.memory.deposit.id
                deleteDeposit(target.room, id)
                creep.suicide()
            }
        }
        else {
            if (target) {
                let resources = Object.keys(creep.store)
                if (resources.length)
                    if (creep.transfer(target, resources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
            }
        }
    }
};





module.exports = roleOut_Harvester;



