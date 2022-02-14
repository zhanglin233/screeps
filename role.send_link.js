/*
 * @Author: zhanglin 
 * @Date: 2022-02-08 19:26:23 
 * @Last Modified by: zhanglin
 * @Last Modified time: 2022-02-11 19:56:30
 */
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

const utils = require("./utils");
let { isMyRoom } = utils
let rooms = ["E43N51", "E43N54", "E46N51", "E49N51", "E41N49", "E43N55", "W12N55", "E39N41", "E51N49"]
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function () {
        for (let roomName of rooms) {
            if (isMyRoom(roomName)) {
                let room = Game.rooms[roomName]
                if (!room.memory.links) {
                    room.memory.links = []
                }
                else if (JSON.stringify(room.memory.links) == "[]") {
                    this.addLinkId(roomName)
                }
                else {
                    if (!Game.time % 50) {
                        this.updateLinkId(roomName)
                    }
                }
                if (!room.memory.containers) {
                    room.memory.containers = []
                }
                else if (JSON.stringify(room.memory.containers) == "[]") {
                    this.addConId(roomName)
                }
                else {
                    if (!Game.time % 50) {
                        this.updateConId(roomName)
                    }
                }
                if (!room.memory.observe) {
                    room.memory.observe = []
                }
                else if (JSON.stringify(room.memory.observe) == "[]") {
                    this.addObserve(roomName)
                }
                this.sendEnergy(roomName)
            }
        }
    },
    /**
     * 向room中添加linkId
     * @param {房间名} roomName 
     */
    addLinkId(roomName) {
        let room = Game.rooms[roomName]
        let sourceIds = Memory.sources[roomName]
        for (const id in sourceIds) {
            let source = Game.getObjectById(id)
            let sourceLink = source.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })
            if (sourceLink.length) {
                let linkId = sourceLink[0].id
                // console.log(linkId);
                room.memory.links.push({ type: "source", linkId: linkId })
            }
        }
        let conLink = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (structure) => structure.structureType == STRUCTURE_LINK
        })
        if (conLink.length) {
            let linkId = conLink[0].id
            room.memory.links.push({ type: "controller", linkId: linkId })
        }
        if (room.storage) {
            let cenLink = room.storage.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })
            if (cenLink.length) {
                let linkId = cenLink[0].id
                room.memory.links.push({ type: "center", linkId: linkId })
            }
        }
    },
    addObserve(roomName) {
        let observe = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_OBSERVER
        })
        if (observe.length) {
            let observeId = observe[0].id
            Game.rooms[roomName].memory.observe.push({ observeId: observeId })
        }
    },
    /**
     * 更新房间的linkId
     * @param {房间名} roomName 
     */
    updateLinkId(roomName) {
        let room = Game.rooms[roomName]
        let links = room.memory.links
        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            let id = link.id
            let sourceIds = Memory.sources[room]
            for (const sourceId in sourceIds) {
                let source = Game.getObjectById(sourceId)
                let sourceLink = source.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                })
                if (sourceLink.length && sourceLink[0].id != id) {
                    let linkId = sourceLink[0].id
                    room.memory.links.push({ type: "source", linkId: linkId })
                }
            }
            let conLink = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => structure.structureType == STRUCTURE_LINK
            })
            if (conLink.length && conLink[0].id != id) {
                let linkId = conLink[0].id
                room.memory.links.push({ type: "controller", linkId: linkId })
            }
            if (room.storage) {
                let cenLink = room.storage.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => structure.structureType == STRUCTURE_LINK
                })
                if (cenLink.length && cenLink[0].id != id) {
                    let linkId = cenLink[0].id
                    room.memory.links.push({ type: "center", linkId: linkId })
                }
            }
        }
    },
    /**
     * 向room中添加containerId
     * @param {房间名} roomName 
     */
    addConId(roomName) {
        let room = Game.rooms[roomName]
        let conCon = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
        })
        if (conCon.length) {
            let conId = conCon[0].id
            room.memory.containers.push({ type: "controller", conId: conId })
            let cons = conCon[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
            })
            for (let i = 0; i < cons.length; i++) {
                if (i == 0) room.memory.containers.push({ type: "source", conId: cons[i].id })
                else room.memory.containers.push({ type: "spawn", conId: cons[i].id })
            }
        }
        else {
            let sourceIds = Memory.sources[roomName]
            for (const id in sourceIds) {
                let source = Game.getObjectById(id)
                let sourceContainer = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
                })
                if (sourceContainer.length) {
                    let conId = sourceContainer[0].id
                    // console.log(linkId);
                    room.memory.containers.push({ type: "source", conId: conId })
                }
            }
        }

    },
    updateCon(roomName) {
        let room = Game.rooms[roomName]
        let containers = room.memory.containers
        for (let i = 0; i < containers.length; i++) {
            let container = containers[i]
            let id = container.id
            let sourceIds = Memory.sources[room]
            for (const sourceId in sourceIds) {
                let source = Game.getObjectById(sourceId)
                let sourceContainer = source.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
                })
                if (sourceContainer.length && sourceContainer[0].id != id) {
                    let conId = sourceContainer[0].id
                    room.memory.containers.push({ type: "spawn", conId: conId })
                }
            }
            let conCon = room.controller.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
            })
            if (conCon.length && conCon[0].id != id) {
                let conId = conCon[0].id
                room.memory.containers.push({ type: "controller", conId: conId })
            }
        }
    },
    /**
     * 更新房间的linkId
     * @param {房间名} roomName 
     */
    updateLinkId(roomName) {
        let room = Game.rooms[roomName]
        let containers = room.memory.containers
        for (let i = 0; i < containers.length; i++) {
            let container = containers[i]
            let id = container.id
            let sourceIds = Memory.sources[room]
            for (const sourceId in sourceIds) {
                let source = Game.getObjectById(sourceId)
                let sourceContainer = source.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
                })
                if (sourceContainer.length && sourceContainer[0].id != id) {
                    let conId = sourceContainer[0].id
                    room.memory.containers.push({ type: "source", conId: conId })
                }
            }
            let conCon = room.controller.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
            })
            if (conCon.length && conCon[0].id != id) {
                let conId = conCon[0].id
                room.memory.containers.push({ type: "controller", conId: conId })
            }
        }
    },
    sendEnergy(roomName) {
        let room = Game.rooms[roomName]
        let links = room.memory.links
        let centerLink, controllerLink;
        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            let { linkId } = link
            let { type } = link
            if (type == "center") {
                centerLink = Game.getObjectById(linkId)
            }
            else if (type == "controller") {
                controllerLink = Game.getObjectById(linkId)
            }
        }
        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            let { linkId } = link
            let { type } = link
            if (type == "source") {
                sourceLink = Game.getObjectById(linkId)
                if (sourceLink) {
                    if (sourceLink.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

                        sourceLink.transferEnergy(centerLink)
                    }
                }
            }
        }

    }
};

module.exports = roleHarvester;
