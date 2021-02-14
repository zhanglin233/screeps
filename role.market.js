/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function () {
        sell_order2 = Game.market.getAllOrders(order => order.resourceType == RESOURCE_ENERGY &&
            order.type == ORDER_BUY &&
            ((order.amount * order.price / 0.28) > (order.amount + Game.market.calcTransactionCost(
                order.amount, 'E43N54', order.roomName)))); // 更慢
        if (sell_order2.length) {
            console.log(sell_order2[0].id);
            Game.market.deal(sell_order2[0].id, sell_order2[0].amount, 'E43N54');
        }
        // if (Game.market.credits > 2500) {
        //     Game.market.createOrder({
        //         type: ORDER_BUY,
        //         resourceType: RESOURCE_ENERGY,
        //         price: 0.252,
        //         totalAmount: 8000,
        //         roomName: "E43N54"
        //     });
        // }

    }
};

module.exports = roleHarvester;



