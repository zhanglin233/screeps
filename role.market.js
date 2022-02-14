/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

// let rooms = ['E43N54',  'E43N55', 'W12N55', 'E39N41']
let rooms = ["E43N51","E49N51","E41N49"]

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function () {
        // if (Game.shard.name == 'shard2') {
        //     var terminal = Game.rooms['E39N41'].terminal
        //     let sell_order1 = Game.market.getAllOrders(order => order.resourceType == RESOURCE_PURIFIER &&
        //         order.type == ORDER_BUY &&order.price>240.00); // 更慢
        //     if (sell_order1.length) {
        //         console.log('sdfsdfsdf');
        //         let index = Math.round(Math.random() * sell_order1.length)
        //         if (sell_order1[index]) {
        //             Game.market.deal(sell_order1[index].id, sell_order1[index].amount, 'E39N41')
        //         }
        //     }
        // }
        for (let room of rooms) {
            
            if (Game.rooms[room] && Game.rooms[room].controller.my) {
                var terminal = Game.rooms[room].terminal

                if (terminal.store[RESOURCE_ENERGY] > 50000) {
                    let sell_order2 = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
                        order.type == ORDER_BUY &&
                        ((order.amount * order.price / 1.3) > (order.amount + Game.market.calcTransactionCost(
                            order.amount, room, order.roomName)))); // 更慢
                    if (sell_order2.length) {
                        // console.log(sell_order2.length);
                        // console.log('room'+Math.round(Math.random() * sell_order2.length));
                        let index = Math.round(Math.random() * sell_order2.length)
                        if (sell_order2[index]) {
                            // console.log(sell_order2[index].id);
                            Game.market.deal(sell_order2[index].id, sell_order2[index].amount, room)
                        }

                    }

                }

                // let sell_order3 = Game.market.getAllOrders(order => order.resourceType == RESOURCE_CATALYST &&
                //     order.type == ORDER_SELL &&
                //     (order.price < 0.80)); // 更慢
                // if (sell_order3.length) {
                //     console.log('market'+sell_order3.length);
                //     // console.log('room'+Math.round(Math.random() * sell_order2.length));
                //     let index = Math.round(Math.random() * sell_order3.length)
                //     if (sell_order3[index]) {
                //         // console.log(sell_order2[index].id);
                //         Game.market.deal(sell_order3[index].id, sell_order3[index].amount, room)
                //     }

                // }
            }


        }


    }
};

module.exports = roleHarvester;
