/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
const { contains } = require("lodash");
let utils = require("utils")
const { isMyRoom } = utils
const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

let rooms = {
    // E43N51: { list: 1, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E43N51: { list: 1, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E43N54: { list: 2, amount: 1, size: { work: 0, carry: 20, move: 10 } },
    E49N51: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E43N55: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E41N49: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E46N51: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    W12N55: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E39N41: { list: 2, amount: 1, size: { carry: 20, move: 10 } },
    E51N49: { list: 2, amount: 1, size: { carry: 6, move: 3 } },
};

let roleLogistician = {
    main: function () {
        for (let room in rooms) {
            if (isMyRoom(room)) {
                if (!Game.rooms[room].memory.roomLogisticsTasks) {
                    // creep.memory.tasks = new List()
                    Game.rooms[room].memory.roomLogisticsTasks = []
                }
                let creep_role = room + 'Logistician';
                let logisticians = _.filter(Game.creeps, (creep) => creep.memory.role == creep_role);
                this.addTasks(room)
                // creep完成任务
                if (logisticians.length) {
                    for (let creep of logisticians) {
                        // creep.suicide()
                        if (this.checkTask(creep)) {
                            if (creep.ticksToLive < 30) {
                                let resources = Object.keys(creep.store)
                                if (resources.length) this.putResource(creep, resources[0], creep.room.storage)
                                this.releaseTask(creep, creep.memory.task)
                            }
                            else this.finishTask(creep, creep.memory.task)
                        }
                        else {
                            this.getTask(creep)
                        }
                        if (creep.ticksToLive < 130 && creep.memory.replace == 0) {
                            this.spawn(room)
                            creep.memory.replace = 1
                            break
                        }

                    }
                }
                // 孵化creep
                if (logisticians.length < rooms[room].amount) {
                    console.log(room)
                    this.spawn(room)
                }
                // 新增任务

            }
        }
    },

    /**
     * 检查当前creep是否存在物流任务
     * 存在则返回true,否则返回false
     * @param {creep} creep 
     */
    checkTask(creep) {
        if (!creep.memory.task || JSON.stringify(creep.memory.task) == "{}") {
            return false
        }
        // console.log(creep.memory.tasks.contains(creep.memory.task));
        // console.log(creep.room.name + "的任务数量为" + creep.room.memory.roomLogisticsTasks.length)
        return true
    },
    /**
     * 为creep分配任务
     * @param {*} creep 
     */
    getTask(creep) {
        if (!creep.room.memory.roomLogisticsTasks) {
            // creep.memory.tasks = new List()
            creep.room.memory.roomLogisticsTasks = []
        }
        else if (creep.room.memory.roomLogisticsTasks.length == 0) creep.say("无事一身轻")
        else {
            creep.memory.task = creep.room.memory.roomLogisticsTasks.shift(creep.memory.task)
            // console.log(creep.memory.task)
        }
    },
    /**
     * creep将要死亡时释放自身的任务到房间任务中
     * @param {*} creep 
     * @param {*} task 
     */
    releaseTask(creep, task) {
        creep.memory.task = {}
        creep.room.memory.roomLogisticsTasks.push(task)
    },
    /**
     * 孵化creep
     * @param {*} room 
     */
    spawn: function (room) {
        let sizeArray = {}
        if (Game.rooms[room].energyCapacityAvailable <= 300) {
            sizeArray = { work: 0, carry: 5, move: 1 }
        }
        if (Game.rooms[room].energyCapacityAvailable < 550) {
            sizeArray = { work: 0, carry: 6, move: 3 }
        }
        else if (Game.rooms[room].energyCapacityAvailable < 800) {
            sizeArray = { work: 0, carry: 8, move: 4 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 800 && Game.rooms[room].energyCapacityAvailable < 1200) {
            sizeArray = { work: 0, carry: 8, move: 4 }
        }
        else if (Game.rooms[room].energyCapacityAvailable >= 1200 && Game.rooms[room].energyCapacityAvailable < 1700) {
            sizeArray = { work: 0, carry: 14, move: 7 }
        }
        else sizeArray = { work: 0, carry: 20, move: 10 }
        // console.log(Game.rooms[room].energyAvailable)
        if (Game.rooms[room].energyAvailable <= 300) {
            sizeArray = { work: 0, carry: 5, move: 1 }
        }
        else if (Game.rooms[room].energyAvailable <= 600) {
            sizeArray = { work: 0, carry: 6, move: 3 }
        }
        let creepRole = room + 'Logistician';
        let name = creepRole + Game.time;
        let size = new Array();
        for (let key in sizeArray) {
            for (let keyLength = 0; keyLength < sizeArray[key]; keyLength++) {
                size.push(key);
                // console.log(size)
            }
        }
        // console.log(size)
        let spawns = Game.rooms[room].spawn
        for (let i = 0; i < spawns.length; i++) {
            spawns[i].spawnCreep(size, name,
                { memory: { role: creepRole, roomName: room, replace: 0 } })
            if (spawns[i].spawning) {
                var spawningCreep = Game.creeps[spawns[i].spawning.name];
                spawns[i].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawns[i].pos.x + 1,
                    spawns[i].pos.y,
                    { align: 'left', opacity: 0.8 });
            }
        }
    },
    /**
     * creep完成身上的任务
     * @param {*} creep 
     * @param {*} task 
     */
    finishTask(creep, task) {
        let { taskType } = task
        let { succeed } = task
        // console.log(taskType);
        // console.log(creep.memory.status)
        // console.log(succeed)
        if (succeed) {
            if (!creep.memory.status) {
                creep.memory.task = {}
            }
            else {
                let resources = Object.keys(creep.store)
                if (resources.length) this.putResource(creep, resources[0], creep.room.storage)
                else creep.memory.status = 0

            }
        }
        else {
            switch (taskType) {
                case "fillSpawns":
                    console.log("执行fillSpawns任务");
                    this.fillSpawns(creep)
                    break
                case "fillTowers":
                    console.log("执行fillSpawns任务");
                    this.fillTower(creep)
                    break
                case "labIn":
                    day = "星期二";
                    break;
                case "labOut":
                    day = "星期三";
                    break;
                case "fillNuker":
                    day = "星期四";
                    break;
                case "boostGetResource":
                    day = "星期五";
                    break;
                case "fillStorage":
                    console.log("执行fillStorage");
                    this.fillStorage(creep)
            }
        }

    },
    /**
     * creep执行填充spawns和exts的任务
     * @param {*} creep 
     */
    fillSpawns(creep) {
        if (!creep.memory.status) this.getResource(creep, RESOURCE_ENERGY)
        else {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target) this.putResource(creep, RESOURCE_ENERGY, target)
            else {
                creep.room.memory.status.fillSpawns = 0
                creep.memory.task.succeed = 1
            }
        }
    },
    /**
     * creep执行填充tower的任务
     * @param {*} creep 
     */
    fillTower(creep) {
        if (!creep.memory.status) this.getResource(creep, RESOURCE_ENERGY)
        else {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 250;
                }
            });
            if (target) this.putResource(creep, RESOURCE_ENERGY, target)
            else {
                creep.memory.task.succeed = 1
                creep.room.memory.status.fillTowers = 0
            }
        }
    },
    fillStorage(creep) {
        console.log(creep);
        console.log(creep.memory.status);
        if (!creep.memory.status) {
            let containers = creep.room.memory.containers
            for (let i = 0; i < containers.length; i++) {
                let { conId } = containers[i]
                let { type } = containers[i]
                let container = Game.getObjectById(conId)
                if (!container) continue
                if (container.store[RESOURCE_ENERGY] > 800 && (type == "spawn" || type == "source")) {
                    this.getResource(creep, RESOURCE_ENERGY,creep.store.getCapacity() - creep.store.getUsedCapacity(),container)

                }
            }
        }
        else {
            let storage = creep.room.storage
            console.log(storage);
            if (storage) {
                console.log(!this.putResource(creep, RESOURCE_ENERGY, storage));
                if (!this.putResource(creep, RESOURCE_ENERGY, storage)) return false
                creep.memory.task.succeed = 1
                creep.room.memory.status.fillStorage = 0
                // console.log(creep.room.name);
            }
            else {
                creep.memory.task.succeed = 1
                creep.room.memory.status.storage = 0
            }
        }
        if(creep.store.getFreeCapacity()==0)creep.memory.status = 1
    },
    /**
     * creep从容器中获取特定数量的特定资源
     * @param {指定的工作的爬} creep 
     * @param {需要获取的资源} resource 
     * @param {需要获取的资源的数目} amount 
     * @param {需要资源的容器} vessel
     */
    getResource(creep, resource, amount, vessel) {
        let room = creep.room
        // console.log(creep.store.getCapacity());
        if (!amount) amount = creep.store.getCapacity() - creep.store.getUsedCapacity()
        if(amount==0){
            creep.memory.status = 1
        }
        console.log(creep + "获取" + resource + ", amount = " + amount);
        let storage = room.storage
        let terminal = room.storage
        if (!vessel) {
            if (storage && storage.store[resource] > amount) {
                if (creep.withdraw(storage, resource, amount) == 0) creep.memory.status = 1
                else if (creep.withdraw(storage, resource, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    creep.say("🛴赶路咯")
                }
            }
            else if (terminal && terminal.store[resource] > amount) {
                if (creep.withdraw(terminal, resource, amount) == 0) creep.memory.status = 1
                else if (creep.withdraw(terminal, resource, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, { visualizePathStyle: { stroke: '#ffaa00' } });
                    creep.say("🛴赶路咯")
                }
            }
            else if (room.controller.level < 5) {
                let containers = room.memory.containers
                for (let i = 0; i < containers.length; i++) {
                    let { conId } = containers[i]
                    let { type } = containers[i]
                    let container = Game.getObjectById(conId)
                    if (!container) break
                    if (container.store[RESOURCE_ENERGY] && type == "spawn") {
                        if (creep.withdraw(container, resource) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                            creep.say("🛴赶路咯")
                        }
                    }
                }
            }
            else {
                console.log("房间" + creep.room.name + "中的" + resource + "资源不够");
            }
        }
        else {
            if (creep.withdraw(vessel, resource, amount) == ERR_NOT_IN_RANGE) {
                creep.moveTo(vessel, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say("🛴赶路咯")
            }
        }
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.status = 1
        }
    },
    /**
     * 将爬身上的资源放到指定的容器中
     * @param {*} creep 
     * @param {*} resource 
     * @param {*} vessel 
     * @returns 
     */
    putResource(creep, resource, vessel) {
        if (!vessel) creep.memory.status = 0;
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = 0;
            return true
        }
        if (creep.transfer(vessel, resource) == 0) return true

        if (creep.transfer(vessel, resource) == -8) creep.memory.status = 0;

        else if (creep.transfer(vessel, resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(vessel);
            creep.say("🛴赶路咯")
        }
    },
    /**
     * 检查room的情况并发布任务
     * @param {} room 
     */
    addTasks(roomName) {
        let room = Game.rooms[roomName]
        if (room.energyAvailable < room.energyCapacityAvailable && (!room.memory.status || !room.memory.status.fillSpawns)) {
            if (!room.memory.status) room.memory.status = {}
            // console.log(room.status);
            taskType = "fillSpawns"
            let task = { taskType, succeed: false }
            room.memory.roomLogisticsTasks.push(task)
            room.memory.status.fillSpawns = 1
        }


        if (!room.memory.status || !room.memory.status.fillTowers) {
            if (!room.memory.status) room.memory.status = {}
            if (!room.memory.status.fillTowers) {
                for (let tower of room.tower) {
                    if (room.memory.status.fillTowers) break
                    // console.log(tower);
                    if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 250) {
                        taskType = "fillTowers"
                        let task = { taskType, succeed: false }
                        room.memory.roomLogisticsTasks.push(task)
                        room.memory.status.fillTowers = 1
                    }
                }
            }
        }

        let storage = room.storage
        if (!storage) return
        if (!room.memory.status || !room.memory.status.fillStorage) {
            if (!room.memory.status) room.memory.status = {}
            if (!room.memory.status.fillStorage) {
                let containers = room.memory.containers
                for (let i = 0; i < containers.length; i++) {
                    let { conId } = containers[i]
                    let { type } = containers[i]
                    let container = Game.getObjectById(conId)
                    if(!container) continue
                    if (container.store[RESOURCE_ENERGY] > 1000 && (type == "spawn" || type == "source")) {
                        taskType = "fillStorage"
                        let task = { taskType, succeed: false }
                        room.memory.roomLogisticsTasks.push(task)
                        room.memory.status.fillStorage = 1
                    }
                }
            }
        }

    }
};

module.exports = roleLogistician;
