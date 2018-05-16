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
        var each_amount = total_amount.div(number);
        console.log(each_amount);
        console.log(address_list);
        console.log(address_list.length);
        for (var num=0;num<address_list.length;num++){
            console.log(num);
            console.log("Address to transfer:"+address_list[num]);
            if(Blockchain.verifyAddress(address_list[num])){
                var result = Blockchain.transfer(address_list[num],each_amount);
                console.log("Transfer status for:"+address_list[num]+" : "+result);
                if(result){
                    total_amount = total_amount.minus(each_amount);
                    console.log("Balance Remaining: "+total_amount.toString());
                }
            }
        }

    }
};
module.exports = BatchDistribute;