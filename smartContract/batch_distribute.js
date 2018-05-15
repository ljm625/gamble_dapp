"use strict";

var BatchDistribute = function () {
    LocalContractStorage.defineProperties(this, {
        balance: null,
        owner: null
    });
    LocalContractStorage.defineMapProperty(this, "balancemap");
};

BatchDistribute.prototype = {
    init: function () {
        console.log("test");
    },

    distribute_equal: function (address_list) {
        // deposit money into multiple address.
        // If, for some reason, some deposit failed (For example bad address), we should still allow the user to retain the balance from his account.
        // Need to check if throw function will rollback transfer action.
        
        var number = address_list.length;
        var total_amount = new BigNumber(Blockchain.transaction.value);
        var each_amount = total_amount.idiv(number);
        for (var address in address_list){
            Blockchain.transfer(address,each_amount);
        }

    }
};
module.exports = BatchDistribute;