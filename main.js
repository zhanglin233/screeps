require('超级移动优化');
require('极致缓存建筑');
require('planner v1.0.1')
require('RoomVisual')
require('utils')
require('List')
// require('63超级扣位置自动布局 单文件傻瓜版')
require('helper_roomResource')
var analyse = require('调用栈分析器v1.2')
// algo_wasm_PriorityQueue
// require('algo_wasm_PriorityQueue')
var market = require('role.market');
var roleDepositer = require('role.deposite');
var factory = require('factory');
var roleLinkHarvester = require('role.link_harvester');
var roleContainer_Creep = require('role.container_creep');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCon_Harvester = require('role.con_harvester');
var roleMineral_Harvester = require('role.mineral_harvester');
var roleObserve = require('role.observe')
// var roleOut_Harvester = require('role.out_harvester');
// var roleOut_withdraw = require('role.out_withdraw');
// var roleOutRepair = require('role.outrepair');
var pc = require('role.pc')
var power = require('power')
var resell = require('resell')
var rolePowerHarvester = require('role.powerharvester')
var rolePowerPicker= require('role.power_picker')
let roleLogistician = require('role.room_logistician')

var roleController = require('role.controll');
var roleTower = require('role.tower');
var roleAttack = require('role.attack');

var roleOut_Builder = require('role.out_builder')
var roleCoreHarvester = require('role.core_harvester');
var roleSendLink = require('role.send_link');
var transport = require('transport');

const { filter } = require('lodash');
let roomStructsData = undefined //放全局变量
/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
module.exports.stateScanner = function () {
    // if(Game.cpu.bucket == 10000) {
    //     Game.cpu.generatePixel();
    // }
    
    
    // 每 20 tick 运行一次
    if (Game.time % 1) return

    if (!Memory.stats) Memory.stats = {}

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gclprogress_precent = Game.gcl.progress - (Memory.stats.gcl * Game.gcl.progressTotal) / 100;
    Memory.stats.gplprogress_precent = Game.gpl.progress - (Memory.stats.gpl * Game.gpl.progressTotal) / 100;

    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;

    Memory.stats.gplLevel = Game.gpl.level;
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    console.log('当前gcl进度'+Memory.stats.gcl);
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket
}


// module.exports.loop = analyse.warpLoop(function () {
//     analyse.print()
// })





module.exports.loop = function () {
    // if(Game.cpu.bucket == 10000) {
    //     Game.cpu.generatePixel();
    // }
    analyse.print()
    //清理内存
    for (var name in Memory.creeps) {
        //如果creep不在，则在内存中清理
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep:', name);
        }
    }
    // // RP('E46N51')
    // var structures = Game.rooms['W12N55'].find(FIND_STRUCTURES)
    // for(var structer of structures){
    //     if(!structer.my){
    //         structer.destroy()
    //     }
    // }
    // stateScanner();
    factory.main();
    pc.main()
    power.main()
    resell.main()
    roleBuilder.main();
    roleController.main();
    roleCon_Harvester.main();
    roleCoreHarvester.main();
    roleContainer_Creep.main();
    roleDepositer.main();
    roleLinkHarvester.main();
    roleMineral_Harvester.main();
    roleObserve.main()
    roleUpgrader.main();
    roleOut_Builder.main();
    // roleOut_Harvester.main();
    // roleOutRepair.main();
    rolePowerHarvester.main();
    rolePowerPicker.main()
    // roleOut_withdraw.main();
    // roleSpawnHarvester.main();

    roleTower.main()
    // roleTransfer.main();
    roleMineral_Harvester.main();
    roleLogistician.main()
    // test.main();
    // market.run();
    analyse.print()
    roleSendLink.run();
    transport.main()


    let p = Game.flags.p; // 触发器
    let pa = Game.flags.pa;
    let pb = Game.flags.pb;
    let pc2 = Game.flags.pc;
    let pm = Game.flags.pm;
    // if(p) {
    //     roomStructsData = ManagerPlanner.computeManor(p.pos.roomName,[pc2,pm,pa,pb])
    //     Game.flags.p.remove()
    // }
    // if(roomStructsData){
    //     // 这个有点消耗cpu 不看的时候记得关
    //     HelperVisual.showRoomStructures(roomStructsData.roomName,roomStructsData.structMap)
    // }
    console.log('--------------------------------------------------------------');
}