/*
 * @Author: zhanglin 
 * @Date: 2022-02-07 15:57:40 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-11 20:39:21
 */

/**
 * 此模块为援建模块,在终端中输入命令即可调用
 * outBuild.help() 弹出温馨提示
 * outBuild.logTask() 显示所有房间的所有援建任务
 * outBuild.logTask(room) 显示目标房间的所有援建任务
 * outBuild.addTask(sourceRoom,targetRoom) 向sourceRoom添加援建targetRoom的任务
 * outBuild.deleteTask(sourceRoom,targetRoom) 删除sourceRoom援建targetRoom的任务
 */

let utils = require('utils')
const { isMyRoom } = utils;
const { keepSourceId } = utils;
const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';
const RANGED_ATTACK = 'ranged_attack';
const HEAL = 'heal';
const TOUGH = 'tough';
const CLAIM = 'claim';
let cross_room = require('cross_room')


let rooms = {
    E43N51: { list: 3, amount: 0, size: { move: 25, carry: 10, work: 15 } },
    E49N51: { list: 3, amount: 0, size: { move: 25, carry: 10, work: 15 } },
    W12N55: { list: 3, amount: 0, size: { move: 25, carry: 10, work: 15 } }
};

let outBuilder = {
    main: function () {
        for (let room in rooms) {
            if (isMyRoom(room)) {
                if (this.checkTask(room)) {
                    rooms[room].amount = 2
                    this.outBuild(room)
                }
            }

        }

    },
    checkTask: function (room) {
        if (!Memory.outBuild || !Memory.outBuild[room]) return false;
        for (const task of Memory.outBuild[room]) {
            let { targetRoom } = task;
            let { succeed } = task;
            console.log("target " + targetRoom + " is " + succeed);
        }
        return true;
    },

    /**
     * 执行room的援建任务
     * @param {提供援建的房间} room 
     */
    outBuild: function (room) {
        for (let i = 0; i < Memory.outBuild[room].length; i++) {
            let task = Memory.outBuild[room][i]
            let { targetRoom } = task;
            let { succeed } = task;
            let creepRole = room + '_out_builder' + targetRoom;
            let outBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == creepRole)
            // 援建任务尚未完成
            if (!succeed) {
                if (outBuilders.length < rooms[room].amount) {
                    this.spawn(room, task);
                }
                if (outBuilders.length) {
                    for (const creep of outBuilders) {
                        if (creep.ticksToLive < 550 && !creep.memory.replace) {
                            this.spawn(room,creep.memory.task)
                            creep.memory.replace = 1
                        }
                        // 赶到目标房间
                        if (this.goToTargetRoom(creep, targetRoom)) {
                            let storage = Game.rooms[targetRoom].storage
                            if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
                                // 有罐子,自己搬
                                this.justBuild(creep, storage)
                            }
                            else {
                                //没有罐子,自己挖能量
                                this.workAndBuild(creep, room)

                            }
                        }
                    }
                }
            }
            // 任务完成
            else {
                // 援建的爬自杀
                if (outBuilders.length) {
                    Memory.sources[creep.room.name] = {}
                    for (const creep of outBuilders) {
                        creep.suicide()
                    }
                }
                // 删除任务
                
                console.log(typeof (Memory.outBuild[room]));
                Memory.outBuild[room].splice(i, 1)
                console.log("删除任务成功");
            }
        }
    },
    /**
     * 检查爬是否抵达目标房间,抵达返回true,为抵达便前往目标房间并返回false
     * @param {指定的工作的爬} creep 
     * @param {目标房间} targetRoom 
     */
    goToTargetRoom(creep, targetRoom) {
        if (creep.room.name != targetRoom) {
            var target = [new RoomPosition(11, 48, 'W11N55'),new RoomPosition(48, 26, 'W11N53'),new RoomPosition(7, 8, 'W10N51'),new RoomPosition(7, 8, 'W12N51')]
            cross_room(creep, target)
            return false
        }
        return true
    },
    /**
     * 挖能量供自己建工地
     * @param {*} creep 
     */
    workAndBuild: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        if (creep.memory.building) {
            this.working(creep)
        }
        else {
            console.log(creep + "拿能量");
            // console.log((this.getEnergy()));
            this.getEnergy(creep)
        }
    },
    /**
     * creep去除storage中的能量工作
     * @param {工作的爬} creep 
     * @param {storage} storage 
     */
    justBuild: function (creep, storage) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        if (creep.memory.building) {
            this.working(creep)
        }
        else {
            this.getStorageEnergy(creep, storage)
        }

    },

    /**
     * 将source_id存入creep的memory
     * @param {*} creep 
     * @param {*} room 
     */
    getSourceId(creep, room) {
        console.log(room);
        if (keepSourceId(room)) {
            console.log("获取id");
            room_sources = Memory.sources[room]
            for (let room_source in room_sources) {
                if (Memory.sources[room][room_source] == 0 && !creep.memory.source_id) {
                    Memory.sources[room][room_source] = 1
                    creep.memory.source_id = room_source
                    break
                }
            }
        }
    },
    /**
     * creep释放房间room内的id为sourceId的资源
     * @param {*} room 
     * @param {*} sourceId 
     */
    releaseSourceId(room, sourceId) {
        if (Memory.sources[room][sourceId] == 1) {
            Memory.sources[room][sourceId] = 0
        }
    },
    /**
     * 获取工地id,获取成功返回true,失败返回false
     * @param {*} creep 
     * @returns 
     */
    getSiteId(creep) {
        //优先建造spawn
        let spawns = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (site) => {
                return (site.structureType == STRUCTURE_SPAWN);
            }
        });
        if (spawns.length) {
            creep.memory.conSiteId = spawns[0].id;
            return true
        }
        else {
            let exts = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => {
                    return (site.structureType == STRUCTURE_EXTENSION);
                }
            });
            if (exts.length) {
                creep.memory.conSiteId = exts[0].id;
                return true
            }
            else {
                let sites = creep.room.find(FIND_CONSTRUCTION_SITES)
                if (sites.length) {
                    creep.memory.conSiteId = sites[0].id;
                    return true
                }
            }
        }
        return false
    },
    /**
     * 工作中的creep
     * @param {指定的工作的爬} creep 
     */
    working(creep) {
        //creep为空闲状态
        console.log((!creep.memory.conSiteId || creep.memory.conSiteId == ""))
        console.log(this.getSiteId(creep))
        if ((!creep.memory.conSiteId || creep.memory.conSiteId == "") && !this.getSiteId(creep)) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            // 所有工地都修建完成则去升级控制器
            else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    creep.say("🛴赶路咯")
                }
                creep.say("🛹升级咯")
            }
        }

        else {
            let site = Game.getObjectById(creep.memory.conSiteId);
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.say("🛴赶路咯")
                creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            if (!site) creep.memory.conSiteId = ""
            creep.say("🛠努力工作");
        }
    },
    /**
     * 挖取source获取能量
     * @param {*} creep 
     */
    getEnergy(creep) {
        // console.log(creep+"拿id");
        // console.log("拿id");
        if (creep.memory.source_id) {
            console.log("拿id");
            if (creep.ticksToLive < 250) {
                this.releaseSourceId(creep.room.name, creep.memory.source_id)
            }
            let source = Game.getObjectById(creep.memory.source_id)
            if (creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.say("🛴赶路咯")
                creep.moveTo(source);
            }
            creep.say("🛠努力工作");
        }
        else {
            console.log("拿id" + creep.room.name);
            this.getSourceId(creep, creep.room.name)
        }
    },
    /**
     * creep从storage中获取能量
     * @param {指定工作的爬} creep 
     * @param {storage容器} storage 
     */
    getStorageEnergy(creep, storage) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.say("🛴赶路咯")
            creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    },
    /**
     * 孵化援建creep
     * @param {*} room 
     * @param {*} targetRoom 
     */
    spawn: function (room, task) {
        // console.log('helloword');
        let { targetRoom } = task
        let creepRole = room + '_out_builder' + targetRoom;
        let name = creepRole + Game.time;
        let size = new Array();
        for (let key in rooms[room].size) {
            for (let keylength = 0; keylength < (rooms[room].size)[key]; keylength++) {
                size.push(key);
                // console.log(size)
            }
        }
        let spawns = Game.rooms[room].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        for (let i = 0; i < spawns.length; i++) {
            spawns[i].spawnCreep(size, name,
                { memory: { role: creepRole, roomName: room, task: task } })
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

};
let outBuild = {
    /**
     * 增加援建任务
     * @param {援建的房间} sourceRoom 
     * @param {被援建的房间} targetRoom 
     * @returns 
     */
    addTask(sourceRoom, targetRoom) {
        //
        if (Game.rooms[sourceRoom] && Game.rooms[sourceRoom].controller.my) {
            if (!Memory.outBuild) {
                Memory.outBuild = {}
            }
            if (!Memory.outBuild[sourceRoom]) {
                Memory.outBuild[sourceRoom] = []
            }
            let task = {
                targetRoom: targetRoom,
                succeed: false,
            }
            Memory.outBuild[sourceRoom].push(task);
            return ("房间" + sourceRoom + "添加援建任务成功");
        }
    },
    /**
     * 删除任务
     * @param {援建的房间} sourceRoom 
     * @param {被援建的房间} targetRoom 
     */
    deleteTask(sourceRoom, targetRoom) {
        if (outBuilder.checkTask(sourceRoom)) {
            for (const task of Memory.outBuild[sourceRoom]) {
                if (task.targetRoom == targetRoom) {
                    task.succeed = true;
                    return "删除房间" + sourceRoom + "援建房间" + targetRoom + "的任务成功"
                }
            }
        }
    },
    /**
     * 打印所有房间的援建任务
     * @returns 
     */
    logTask() {
        let s = ''
        let rooms = _.values(Game.rooms).filter(e => e.controller && e.controller.my && (e.storage || e.terminal));
        for (let room of rooms) {
            if (Memory.outBuild && JSON.stringify(Memory.outBuild[sourceRoom]) != "[]") {

                for (let task of Memory.outBuild[sourceRoom]) {
                    s = s + room + "正援建" + task.targetRoom + " " + "\n"
                }
            }
        }
        if (s != '') return s
        return "所有房间暂无援建任务"
    },
    /**
     * 显示目标房间的所有援建任务
     * @param {} sourceRoom 
     */
    logTask(sourceRoom) {
        let s = ''
        if (Memory.outBuild && JSON.stringify(Memory.outBuild[sourceRoom]) != "[]") {

            for (let task of Memory.outBuild[sourceRoom]) {
                s = s + task.targetRoom + " " + task.succeed + "\n"
            }
            return s
        }
        return "房间" + sourceRoom + "暂无援建任务"
    },
    /**
     * 打印帮助信息
     * @returns 
     */
    help() {
        let s = "\t\toutBuild.logTask() 显示所有房间的所有援建任务\n\
                outBuild.logTask(room) 显示目标房间的所有援建任务\n\
                outBuild.addTask(sourceRoom,targetRoom) 向sourceRoom添加援建targetRoom的任务\n\
                outBuild.deleteTask(sourceRoom,targetRoom) 删除sourceRoom援建targetRoom的任务\n\
                "
        return s
    }
}
global.outBuild = outBuild;
module.exports = outBuilder;
