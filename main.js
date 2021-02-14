var market = require('role.market');
var roleHarvester = require('role.harvester');
var roleHarvester2 = require('role.harvester2');
var roleLinkHarvester2 = require('role.link_harvester2');
var roleContainer_Creep = require('role.container_creep');
var roleContainer_Creep2 = require('role.container_creep2');
var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleBuilder = require('role.builder');
var roleBuilder2 = require('role.builder2');
var roleCon_Harvester = require('role.con_harvester');
var roleCon_Harvester2 = require('role.con_harvester2');
var roleTower_Harvester = require('role.tower_harvester');
var roleTower_Harvester2 = require('role.tower_harvester2');
var roleMineral_Harvester = require('role.mineral_harvester');
var roleMineral_Harvester2 = require('role.mineral_harvester2');
var roleOut_Harvester = require('role.out_harvester');
var roleOut_Harvester2 = require('role.out_harvester2');
var roleOut_withdraw = require('role.out_withdraw');
var roleOutRepair = require('role.outrepair');

var roleController = require('role.controll');
var roleTower = require('role.tower');
var roleAttack = require('role.attack');
var roleAttack2 = require('role.attack2');
var roleOut_Builder = require('role.out_builder');
var roleCoreHarvester = require('role.core_harvester');
var roleCoreHarvester2 = require('role.core_harvester2');
var roleSendLink = require('role.send_link');
var roleSendLink2 = require('role.send_link2');
var roleSpawnHarvester = require('role.spawn_harvester');
var roleSpawnHarvester2 = require('role.spawn_harvester2');

const { filter } = require('lodash');
var harvester_amount = 1;
var harvester2_amount = 1;
var link_harvester2_amount = 1;
var upgrader_amount = 1;
var upgrader2_amount = 4;

var builder_amount = 2;
var builder2_amount = 3;

var con_harvester_amount = 1;
var con_harvester2_amount = 3;

var tower_harvester_amount = 1;
var tower_harvester2_amount = 1;
var mineral_harvester_amount = 1;
var mineral_harvester2_amount = 1;

var out_harvester_amount = 0;
var out_harvester2_amount = 0;
var out_withdraw_amount = 0;
var out_repair_amount = 0;




var attack_amount = 1;
var attack2_amount = 0;

var controller_amount = 1;
var out_builder_amount = 0;
var core_harvester_amount = 1;
var core_harvester2_amount = 1;
var spawn_harvester_amount = 3;
var spawn_harvester2_amount = 2;

// var stateScanner = require('role.stateScanner.js');

/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
module.exports.stateScanner = function () {
    market.run();
    // 每 20 tick 运行一次
    if (Game.time % 20) return

    if (!Memory.stats) Memory.stats = {}

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
    Memory.stats.gclprogress_precent = Game.gcl.progress - (Memory.stats.gcl * Game.gcl.progressTotal) / 100;
    Memory.stats.gplLevel = Game.gpl.level;
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    Memory.stats.gplprogress_precent = Game.gpl.progress - (Memory.stats.gpl * Game.gpl.progressTotal) / 100;
    console.log(Memory.stats.gcl);
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket
}

module.exports.loop = function () {
    var tower1s = Game.rooms['E43N54'].find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER
            }
        });
    for (var tower of tower1s) {
        roleTower.run(tower);
    }
    var tower2s = Game.rooms['E43N51'].find(FIND_STRUCTURES,
        {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER
            }
        });
    for (var tower of tower2s) {
        roleTower.run(tower);
    }

    //清理内存
    for (var name in Memory.creeps) {
        //如果creep不在，则在内存中清理
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep:', name);
        }
    }

    if (!Game.creeps['Harvester1']) {
        Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'Harvester1',
            { memory: { role: 'container_creep' } });
    }
    if (!Game.creeps['Harvester2']) {
        Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'Harvester2',
            { memory: { role: 'container_creep' } });
    }
    if (!Game.creeps['E43N51_1']) {
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], 'E43N51_1',
            { memory: { role: 'container_creep2' } });
    }
    if (!Game.creeps['E43N52_2']) {
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE,], 'E43N51_2',
            { memory: { role: 'container_creep2' } });
    }


    var spawn_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawn_harvester');
    console.log('SpawnHarvesters:' + spawn_harvester.length);
    if (spawn_harvester.length < spawn_harvester_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var spawn_harvester_newname = 'SpawnHarvester' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], spawn_harvester_newname,
            { memory: { role: 'spawn_harvester' } });
    }
    var spawn_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'spawn_harvester2');
    console.log('SpawnHarvester2s:' + spawn_harvester2.length);
    if (spawn_harvester2.length < spawn_harvester2_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var spawn_harvester_newname = 'SpawnHarvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], spawn_harvester_newname,
            { memory: { role: 'spawn_harvester2' } });
    }
    //如果harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters:' + harvester.length);

    if (harvester.length < harvester_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var harvester_newname = 'Harvester' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], harvester_newname,
            { memory: { role: 'harvester' } });
    }
    var harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
    console.log('Harvester2s:' + harvester2.length);
    if (harvester2.length < harvester2_amount && spawn_harvester2.length >= spawn_harvester2_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var harvester_newname = 'Harvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], harvester_newname,
            { memory: { role: 'harvester2' } });
    }
    var link_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'link_harvester2');
    console.log('LinkHarvester2s:' + link_harvester2.length);
    if (link_harvester2.length < link_harvester2_amount && spawn_harvester2.length >= spawn_harvester2_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var link_harvester2_newname = 'LinkHarvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], link_harvester2_newname,
            { memory: { role: 'link_harvester2' } });
    }

    // //如果con_harvester的数量小于6,则自动孵化harvester
    // //首先需要获得harvester的数量
    var controller = _.filter(Game.creeps, (creep) => creep.memory.role == 'controller');
    console.log('Controller:' + controller.length);
    if (spawn_harvester.length>=spawn_harvester_amount&&controller.length < controller_amount) {
        var controller_newname = 'Controller' + Game.time;
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], controller_newname,
                { memory: { role: 'controller' } });
        }
    }
    //如果harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgrader:' + upgrader.length);
    if (spawn_harvester.length>=spawn_harvester_amount&& upgrader.length < upgrader_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var upgrader_newname = 'Upgrader' + Game.time;
        //输出新名字
        // console.log(newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], upgrader_newname,
                { memory: { role: 'upgrader' } });
        }

    }

    var upgrader2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader2');
    console.log('Upgrader2:' + upgrader.length);
    if (spawn_harvester2.length >= spawn_harvester2_amount && upgrader2.length < upgrader2_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var upgrader2_newname = 'Upgrader2' + Game.time;
        //输出新名字
        // console.log(newname);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], upgrader2_newname,
            { memory: { role: 'upgrader2' } });

    }



    //如果con_harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var con_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'con_harvester');
    console.log('ConHarvesters:' + con_harvester.length);

    if (spawn_harvester.length>=spawn_harvester_amount&& upgrader.length == upgrader_amount && con_harvester.length < con_harvester_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var con_harvester_newname = 'ConHarvester' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], con_harvester_newname,
                { memory: { role: 'con_harvester' } });
        }

    }

    var con_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'con_harvester2');
    console.log('ConHarvester2s:' + con_harvester2.length);

    if (spawn_harvester2.length >= spawn_harvester2_amount && con_harvester2.length < con_harvester2_amount) {
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var con_harvester2_newname = 'ConHarvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], con_harvester2_newname,
            { memory: { role: 'con_harvester2' } });

    }
    //如果harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builder:' + builder.length);
    if (spawn_harvester.length>=spawn_harvester_amount&& builder.length < builder_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var builder_newname = 'Builder' + Game.time;
        //输出新名字
        // console.log(builder_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], builder_newname,
                { memory: { role: 'builder' } });
        }
    }

    var builder2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder2');
    console.log('Builder2:' + builder2.length);
    if (spawn_harvester2.length >= spawn_harvester2_amount && builder2.length < builder2_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var builder2_newname = 'Builder2' + Game.time;
        //输出新名字
        // console.log(builder_newname)
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,MOVE], builder2_newname,
            { memory: { role: 'builder2' } });
    }
    //如果harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var tower_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'tower_harvester');
    console.log('tower_harvester:' + tower_harvester.length);
    if (spawn_harvester.length>=spawn_harvester_amount&& tower_harvester.length < tower_harvester_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var tower_harvester_newname = 'TowerHarvester' + Game.time;
        //输出新名字
        // console.log(builder_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], tower_harvester_newname,
                { memory: { role: 'tower_harvester' } });
        }
    }

    var tower_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'tower_harvester2');
    console.log('tower_harvester2:' + tower_harvester2.length);
    if (spawn_harvester2.length >= spawn_harvester2_amount && tower_harvester2.length < tower_harvester2_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var tower_harvester2_newname = 'TowerHarvester2' + Game.time;
        //输出新名字
        // console.log(builder_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], tower_harvester2_newname,
            { memory: { role: 'tower_harvester2' } });
    }

    var mineral_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineral_harvester');
    console.log('mineral_harvester:' + mineral_harvester.length);
    if (spawn_harvester.length>=spawn_harvester_amount&& mineral_harvester.length < mineral_harvester_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var mineral_harvester_newname = 'MineralHarvester' + Game.time;
        //输出新名字
        // console.log(builder_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], mineral_harvester_newname,
                { memory: { role: 'mineral_harvester' } });
        }
    }

    var mineral_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineral_harvester2');
    console.log('mineral_harvester:' + mineral_harvester.length);
    if (spawn_harvester.length>=spawn_harvester_amount&& mineral_harvester2.length < mineral_harvester2_amount) {
        //给upgrader定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var mineral_harvester2_newname = 'MineralHarvester2' + Game.time;
        //输出新名字
        // console.log(builder_newname);
            Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], mineral_harvester2_newname,
                { memory: { role: 'mineral_harvester2' } });
    }



    var attack = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack');
    console.log('attack:' + attack.length);
    if (attack.length < attack_amount) {
        Memory.ATTACKstatus = false;
        roleAttack.run();
    }
    else {
        Memory.ATTACKstatus = true;
        roleAttack.run();
    }
    var attack2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack2');
    console.log('attack2:' + attack2.length);
    if (attack2.length < attack2_amount) {
        Memory.ATTACK2status = false;
        roleAttack2.run();
    }
    else {
        Memory.ATTACK2status = true;
        roleAttack2.run();
    }
    //如果con_harvester的数量小于6,则自动孵化harvester
    //首先需要获得harvester的数量
    var out_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_harvester');
    console.log('OutHarvesters:' + out_harvester.length);

    if (spawn_harvester.length>=spawn_harvester_amount&&out_harvester.length < out_harvester_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        // var out_harvester_newname = 'OutHarvester' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            if (!Game.creeps['outHarvester1']) {
                Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'outHarvester1',
                    { memory: { role: 'out_harvester' } });
            }
            else {
                Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'outHarvester2',
                    { memory: { role: 'out_harvester' } });
            }
        }
    }
    var out_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_harvester2');
    console.log('OutHarvester2s:' + out_harvester2.length);

    if (out_harvester2.length < out_harvester2_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var out_harvester2_newname = 'OutHarvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], out_harvester2_newname,
            { memory: { role: 'out_harvester2' } });
    }


    var out_withdraw = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_withdraw');
    console.log('OutWithdraws:' + out_withdraw.length);

    if (spawn_harvester.length>=spawn_harvester_amount&&out_withdraw.length < out_withdraw_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var out_withdraw_newname = 'OutWithdraw' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], out_withdraw_newname,
            { memory: { role: 'out_withdraw' } });
    }

    var out_repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_repair');
    console.log('OutRepairs:' + out_repair.length);

    if (spawn_harvester.length>=spawn_harvester_amount&&out_repair.length < out_repair_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var out_repair_newname = 'Outrepair' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE, MOVE], out_repair_newname,
            { memory: { role: 'out_repair' } });
    }
    var out_builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'out_builder');
    console.log('OutBuilder:' + out_builder.length);

    if (spawn_harvester.length>=spawn_harvester_amount&&out_builder.length < out_builder_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var out_builder_newname = 'OutBuilder' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], out_builder_newname,
                { memory: { role: 'out_builder' } });
        }
    }

    var core_harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'core_harvester');
    console.log('core_harvester:' + core_harvester.length);

    if (spawn_harvester.length>=spawn_harvester_amount&&core_harvester.length < core_harvester_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var core_harvester_newname = 'core_harvester' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        if (Game.creeps['Harvester1'] && Game.creeps['Harvester2']) {
            Game.spawns['ZhangLin1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY,CARRY,MOVE, MOVE, MOVE, MOVE], core_harvester_newname,
                { memory: { role: 'core_harvester' } });
        }
    }

    var core_harvester2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'core_harvester2');
    console.log('core_harvester:' + core_harvester.length);

    if (harvester2.length >= harvester2_amount && core_harvester2.length < core_harvester2_amount) {
        // OutStorage = Game.getObjectById('5fcef12c35a42c094b0c9ad1');
        // console.log(OutStorage);
        //给harvester定义一个名字，这个名字是由Harvester和游戏时间拼接而成。
        //harvester名字不可以重复
        var core_harvester2_newname = 'core_harvester2' + Game.time;
        //输出新名字
        // console.log(harvester_newname);
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], core_harvester2_newname,
            { memory: { role: 'core_harvester2' } });
    }

    //如果spawn正在孵化creep，
    //Game.spawns['ZhangLin1].spawning返回的是一个对象，不是true和false
    if (Game.spawns['ZhangLin1'].spawning) {
        // Game.spawns['ZhangLin1'].spawning.name获取正在孵化的creep的名字
        //用名字获取creep
        var spawningCreep = Game.creeps[Game.spawns['ZhangLin1'].spawning.name]
        // 在名为ZhangLin1的房间内显示文本
        //Game.spawns['Spawn1'].room.visual.text的参数为文本内容，x坐标,y坐标,输出文本的格式
        Game.spawns['ZhangLin1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['ZhangLin1'].pos.x + 1,
            Game.spawns['ZhangLin1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(creep.ticksToLive);

        if (creep.ticksToLive < 200) {

        }
        if (creep.memory.role == 'controller') {
            roleController.run(creep);
        }
        if (creep.memory.role == 'spawn_harvester') {
            roleSpawnHarvester.run(creep);
        }
        if (creep.memory.role == 'spawn_harvester2') {
            roleSpawnHarvester2.run(creep);
        }
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'harvester2') {
            roleHarvester2.run(creep);
        }
        if (creep.memory.role == 'link_harvester2') {
            roleLinkHarvester2.run(creep);
        }
        if (creep.memory.role == 'container_creep') {
            roleContainer_Creep.run(creep);

        }
        if (creep.memory.role == 'container_creep2') {
            roleContainer_Creep2.run(creep);

        }
        if (creep.memory.role == 'con_harvester') {
            roleCon_Harvester.run(creep);
        }
        if (creep.memory.role == 'con_harvester2') {
            roleCon_Harvester2.run(creep);
        }
        if (creep.memory.role == 'out_harvester') {
            roleOut_Harvester.run(creep);
        }

        if (creep.memory.role == 'out_harvester2') {
            roleOut_Harvester2.run(creep);
        }
        if (creep.memory.role == 'out_withdraw') {
            roleOut_withdraw.run(creep);
        }
        if (creep.memory.role == 'out_repair') {
            roleOutRepair.run(creep);
        }
        if (creep.memory.role == 'tower_harvester') {
            roleTower_Harvester.run(creep);
        }
        if (creep.memory.role == 'tower_harvester2') {
            roleTower_Harvester2.run(creep);
        }

        if (creep.memory.role == 'mineral_harvester') {
            roleMineral_Harvester.run(creep);
        }
        if (creep.memory.role == 'mineral_harvester2') {
            roleMineral_Harvester2.run(creep);
        }
        // if (creep.memory.role == 'controller') {
        //     roleController.run(creep);
        // }
        // roleController.run();
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'upgrader2') {
            roleUpgrader2.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'builder2') {
            roleBuilder2.run(creep);
        }
        if (creep.memory.role == 'out_builder') {
            roleOut_Builder.run(creep);
        }
        if (creep.memory.role == 'core_harvester') {
            roleCoreHarvester.run(creep);
        }
        if (creep.memory.role == 'core_harvester2') {
            roleCoreHarvester2.run(creep);
        }
    }
    this.stateScanner();
    roleSendLink.run();
    roleSendLink2.run();
}