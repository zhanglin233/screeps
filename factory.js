/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

const { object } = require("lodash");

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';
const ATTACK = 'attack';

// const RESOURCE_KEANIUM_BAR = 'resource_keanium_bar';
// const RESOURCE_MIST = 'resource_mist';
// const RESOURCE_ENERGY = 'resource_energy';
// const RESOURCE_CONDENSATE = 'resource_condensate';

let rooms = {
    E43N51: {
        // list1: { amount: 0, materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: '' },
        // list1: { amount: 150, materials: [ RESOURCE_CONCENTRATE, RESOURCE_SILICON,RESOURCE_CONDENSATE, RESOURCE_OXIDANT, RESOURCE_ENERGY], scale: { concentrate: 5, condensate: 15, oxidant: 30, energy: 8 }, product: RESOURCE_EXTRACT, prodcute_goal: '' },

        // list2: { amount: 0, materials: [RESOURCE_HYDROGEN, RESOURCE_ENERGY], scale: { H: 5, energy: 2 }, product: RESOURCE_REDUCTANT, prodcute_goal: 'sell' },
        // list1: { amount: 0, materials: [RESOURCE_UTRIUM, RESOURCE_ENERGY], scale: { U: 5, energy: 2 }, product: RESOURCE_UTRIUM_BAR, prodcute_goal: '' },
        // list3: { amount: 7, materials: [RESOURCE_REDUCTANT, RESOURCE_CONDENSATE,RESOURCE_KEANIUM_BAR, RESOURCE_ENERGY], scale: { condensate: 10,keanium_bar:5, energy: 4,reductant: 18 }, product: RESOURCE_CONCENTRATE, prodcute_goal: '' },
        // list1: { materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
        list3: { materials: [RESOURCE_KEANIUM_BAR, RESOURCE_MIST, RESOURCE_ENERGY], scale: { keanium_bar: 1, mist: 5, energy: 2 }, product: RESOURCE_CONDENSATE, prodcute_goal: '' },
        // list2: { amount: 0, materials: [RESOURCE_CONCENTRATE, RESOURCE_CONDENSATE,RESOURCE_OXIDANT,RESOURCE_ENERGY], scale: { concentrate: 5,condensate:15, energy: 8,oxidant:30 }, product: RESOURCE_EXTRACT, prodcute_goal: '' },
        // list4: { amount: 0, materials: [RESOURCE_ZYNTHIUM, RESOURCE_ENERGY], scale: { Z: 5,energy: 2 }, product: RESOURCE_ZYNTHIUM_BAR, prodcute_goal: '' }
    },
    E43N54: {

        list2: { materials: [RESOURCE_OXYGEN, RESOURCE_ENERGY], scale: { O: 5, energy: 2 }, product: RESOURCE_OXIDANT, prodcute_goal: 'sell' },
        // list3: { materials: [RESOURCE_ZYNTHIUM_BAR, RESOURCE_METAL, RESOURCE_ENERGY], scale: { zynthium_bar: 1, metal: 5, energy: 2 }, product: RESOURCE_ALLOY, prodcute_goal: '' },
        // list3: {materials: [RESOURCE_REDUCTANT, RESOURCE_CONDENSATE, RESOURCE_KEANIUM_BAR, RESOURCE_ENERGY], scale: { condensate: 10, keanium_bar: 5, energy: 4, reductant: 18 }, product: RESOURCE_CONCENTRATE, prodcute_goal: 'store' },
    },
    // E41N49: {
    //     list1: { materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
    //     list2: { materials: [RESOURCE_KEANIUM_BAR, RESOURCE_MIST, RESOURCE_ENERGY], scale: { keanium_bar: 1, mist: 5, energy: 2 }, product: RESOURCE_CONDENSATE, prodcute_goal: 'store' },
    // },
    // E49N51: {
    //     list1: { materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
    //     // list3: { amount: 0, materials: [RESOURCE_KEANIUM_BAR, RESOURCE_MIST, RESOURCE_ENERGY], scale: { keanium_bar: 1, mist: 5, energy: 2 }, product: RESOURCE_CONDENSATE, prodcute_goal: 'sell' },
    //     // list2: { amount: 50000, materials: [RESOURCE_ENERGY],scale:{energy: 1 }, product: RESOURCE_ENERGY,prodcute_goal:'' },
    //     // list1: { amount: 0, materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
        list2: { materials: [RESOURCE_UTRIUM, RESOURCE_ENERGY], scale: { U: 5, energy: 2 }, product: RESOURCE_UTRIUM_BAR, prodcute_goal: 'store' },
    //     // list2: { amount: 0, materials: [RESOURCE_UTRIUM],scale:{U: 1 }, product: RESOURCE_UTRIUM,prodcute_goal:'' },
    //     // list3: { materials: [RESOURCE_UTRIUM_BAR, RESOURCE_SILICON, RESOURCE_ENERGY], scale: { utrium_bar: 1, energy: 2, silicon: 5 }, product: RESOURCE_WIRE, prodcute_goal: 'store' },
    //     // list4: { materials: [RESOURCE_KEANIUM_BAR, RESOURCE_MIST, RESOURCE_ENERGY], scale: { keanium_bar: 1, mist: 5, energy: 2 }, product: RESOURCE_CONDENSATE, prodcute_goal: 'store' },

    //     list3: { materials: [RESOURCE_UTRIUM_BAR, RESOURCE_OXIDANT, RESOURCE_ENERGY,RESOURCE_WIRE], scale: { utrium_bar: 7, energy: 4, wire: 8,oxidant:19 }, product: RESOURCE_SWITCH, prodcute_goal: 'store' },
    //     list2: { materials: [RESOURCE_UTRIUM_BAR, RESOURCE_ZYNTHIUM_BAR, RESOURCE_ENERGY], scale: { utrium_bar: 1, energy: 1, zynthium_bar: 1}, product: RESOURCE_COMPOSITE, prodcute_goal: 'sell' },
        
    // },
    E43N55: {
        list1: { materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
        // list2: { amount: 7000, materials: [], scale: { H: 5, energy: 2 }, product: RESOURCE_HYDROGEN, prodcute_goal: '' },
        list2: { materials: [RESOURCE_HYDROGEN, RESOURCE_ENERGY], scale: { H: 5, energy: 2 }, product: RESOURCE_REDUCTANT, prodcute_goal: '' }
        // list1: { amount: 0, materials: [RESOURCE_HYDROGEN, 'RESOURCE_MIST', 'RESOURCE_ENERGY'], product: RESOURCE_CONDENSATE }
        // list2: { amount: 0, materials: ['RESOURCE_KEANIUM_BAR', 'RESOURCE_MIST', 'RESOURCE_ENERGY'], product: 'RESOURCE_CONDENSATE' }
    },
    E46N51: {
        list1: { materials: [RESOURCE_CATALYST, RESOURCE_ENERGY], scale: { X: 5, energy: 2 }, product: RESOURCE_PURIFIER, prodcute_goal: 'store' },
        list2: { materials: [RESOURCE_KEANIUM, RESOURCE_ENERGY], scale: { K: 5, energy: 2 }, product: RESOURCE_KEANIUM_BAR, prodcute_goal: 'store' },
        list3: { materials: [RESOURCE_KEANIUM_BAR, RESOURCE_MIST, RESOURCE_ENERGY], scale: { keanium_bar: 1, mist: 5, energy: 2 }, product: RESOURCE_CONDENSATE, prodcute_goal: '' },
    }

};
let factory = {
    main: function () {
        for (let room in rooms) {
            if (!Memory.taskFactory) {
                Memory.taskFactory = {}
            }
            else {
                if (!Memory.taskFactory[room]) {
                    Memory.taskFactory[room] = {}

                }
                else {
                    if (Game.rooms[room] && Game.rooms[room].controller.my) {
                        this.Creep(room);
                    }
                }
            }

        }

    },

    Creep: function (room) {
        let creeprole = room + 'core_harvester';
        // let product = room[room].product;
        let core_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == creeprole);
        if (core_harvesters.length) {
            this.run(core_harvesters[0], room)
        }
    },

    run: function (creep, room) {
        //产品生产数量
        let productAmount = 500
        let factory = Game.rooms[room].factory
        let storage = Game.rooms[room].storage
        let terminal = Game.rooms[room].terminal
        let links = factory.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (structure) => structure.structureType == STRUCTURE_LINK
        })[0]
        let product = ''
        //标记当前是否为生产状态，0为空闲状态，需要检查原材料余量，为1则跳过检查

        if (links.store[RESOURCE_ENERGY] == 0 && creep.memory.withdrawEnergy == 0) {
            for (let list in rooms[room]) {
                productAmount = 500
                // console.log(room + list);
                let materials = rooms[room][list].materials;
                for (let material of materials) {

                    // console.log(room+material+(storage.store[material] + factory.store[material] + terminal.store[material]));
                    // console.log(Memory.taskFactory[room].productTag);
                    // console.log(material + ':' + room[room][list].scale[material]);
                    if ((storage.store[material] + factory.store[material] + terminal.store[material]) / rooms[room][list].scale[material] < productAmount && !Memory.taskFactory[room].productTag) {
                        //原材料库存不足，检查下一个产品原材料情况
                        productAmount = 0
                    }
                }
                //原材料充足，可以生产
                if (productAmount > 0) {
                    //转为生产状态
                    if (!Memory.taskFactory[room].product||Memory.taskFactory[room].product=='') {
                        product = rooms[room][list].product
                        Memory.taskFactory[room].product = product
                    }
                    else{
                        product = Memory.taskFactory[room].product
                        // console.log(room+product);
                    }
                    if (Object.keys(Memory.taskFactory[room]).indexOf('productAmount') <= -1) {
                        Memory.taskFactory[room].productAmount = productAmount
                    }
                    else {
                        if (Object.keys(Memory.taskFactory[room]).indexOf('taskType') <= -1) {
                            Memory.taskFactory[room].taskType = 'produceTransfer'
                        }
                        else {
                            // let fee = Game.market.calcTransactionCost(amount, room, targetRoom)
                            //运输原材料
                            if (Memory.taskFactory[room].taskType == 'produceTransfer') {

                                let link = factory.pos.findInRange(FIND_STRUCTURES, 3, {
                                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                                })[0]
                                let tag = 1
                                for (let material of materials) {
                                    if (factory.store[material] < rooms[room][list].scale[material] * productAmount) {
                                        tag = 0
                                        this.transport(creep, link, terminal, storage, factory, material)
                                        break
                                    }
                                    else {
                                        tag = 1
                                    }
                                }
                              
                                if (tag) {
                                    Memory.taskFactory[room].taskType = 'produce'
                                    Memory.taskFactory[room].productTag = 1
                                }
                                
                            }
                            //生产
                            else if (Memory.taskFactory[room].taskType == 'produce') {
                                
                                if (factory.store[product] >= productAmount) {
                                    Memory.taskFactory[room].taskType = 'transfer'
                                }
                                else {
                                    factory.produce(product)
                                }

                            }
                            //转移产品
                            else if (Memory.taskFactory[room].taskType == 'transfer') {
                                if (creep.memory.status == 0) {
                                    if (factory.store[product] > 0) {
                                        if (creep.withdraw(factory, product) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(factory)
                                        }
                                    }
                                    else if (factory.store[product] == 0) {
                                        Memory.taskFactory[room].taskType = 'produceTransfer'
                                        Memory.taskFactory[room].product = ''
                                        Memory.taskFactory[room].productTag = 0
                                        // if (storage.store[mineralType] >= 50000) {
                                        //     Memory.taskFactory[room].taskType = 'produceTransfer'
                                        //     Memory.taskFactory[room].productAmount = parseInt((factory.store.getCapacity() - factory.store.getUsedCapacity() - 750) / 700) * 100
                                        // }
                                    }

                                    if (creep.store.getUsedCapacity() != 0) {
                                        creep.memory.status = 1
                                    }
                                }
                                else {
                                    if (factory.store[product] == 0) {
                                        Memory.taskFactory[room].taskType = 'produceTransfer'
                                        Memory.taskFactory[room].product = ''
                                        Memory.taskFactory[room].productTag = 0
                                        // if (storage.store[mineralType] >= 50000) {
                                        //     Memory.taskFactory[room].taskType = 'produceTransfer'
                                        //     Memory.taskFactory[room].productAmount = parseInt((factory.store.getCapacity() - factory.store.getUsedCapacity() - 750) / 700) * 100
                                        // }
                                    }
                                    if (creep.store.getUsedCapacity() == 0) {
                                        creep.memory.status = 0
                                    }
                                    if (creep.transfer(storage, product) == ERR_NOT_IN_RANGE) {
                                        console.log('gugjgj');
                                        creep.moveTo(storage)
                                    }
                                }
                            }

                        }
                    }
                    break
                }
            }
        }
    },

    transport: function (creep, link, terminal, storage, factory, source) {
        if (link.store[RESOURCE_ENERGY] == 0 && creep.memory.withdrawEnergy == 0) {
            if (creep.memory.status == 0) {
                if (terminal.store[source] > 0) {
                    if (creep.withdraw(terminal, source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal)
                    }
                }
                else if (storage.store[source] > 0) {
                    if (creep.withdraw(storage, source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage)
                    }
                }

            }
            else {
                if (creep.store.getUsedCapacity() == 0) {
                    creep.memory.status = 0
                }
                if (creep.transfer(factory, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(factory)
                }
            }
        }

        if (creep.memory.status == 1) {


            if (creep.store.getUsedCapacity() == 0) {
                creep.memory.status = 0
            }
            if (creep.transfer(factory, Object.keys(creep.store)[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(factory)
            }
        }
        else {
            if (creep.store.getUsedCapacity() != 0) {
                creep.memory.status = 1
            }
        }
    }
};

module.exports = factory;

