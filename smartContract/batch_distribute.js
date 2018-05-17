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
    // Check if it's a array
    if(!Array.isArray(address_list)){
      throw new Error("Invalid Input: Input need to be a array");
    }
    var total_amount = new BigNumber(Blockchain.transaction.value);
    if(total_amount.lte(0)){
      throw new Error("Need to transfer NAS in order to do split distribute");
    }
    var number = address_list.length;
    var each_amount = total_amount.div(number);
    console.log(each_amount);
    console.log(address_list);
    console.log(address_list.length);
    console.log("Address from: "+Blockchain.transaction.from);
    // In order to work, first, validate all address input, if invalid, throw exception and return money.
    var num =0;

    for (num=0;num<address_list.length;num++) {
      console.log("Address to transfer:"+address_list[num]);
      if(!Blockchain.verifyAddress(address_list[num])){
           // The address is not valid
        console.log("Address not valid:"+address_list[num]);
        // var result = Blockchain.transfer(Blockchain.transaction.from,total_amount);
        var result=true;
        // if(result){
        //   // No need to save it temporary
        //   console.log("Transfer back success");
        // }
        // else{
        //   console.log("Transfer back failed");
        // }
        throw new Error("Input address not valid! The money is already rolled back.");
      }
    }

    for (num=0;num<address_list.length;num++){
      console.log(num);
      var result = Blockchain.transfer(address_list[num],each_amount);
      console.log("Transfer status for:"+address_list[num]+" : "+result);
      if(result){
        total_amount = total_amount.minus(each_amount);
        console.log("Balance Remaining: "+total_amount.toString());
      }
    }

  }
};
module.exports = BatchDistribute;
