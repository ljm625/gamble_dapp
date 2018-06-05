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
    // console.log("Testing code: ");
    // var test_amount=new BigNumber(88);
    // Blockchain.transfer("n1Y9JLyHUdHqFTvZD9S2a5acx6vsPeTHFCJ",test_amount)
    // console.log("Test End");
    // In order to work, first, validate all address input, if invalid, throw exception and return money.
    var num =0;

    for (num=0;num<address_list.length;num++) {
      console.log("Address to transfer:"+address_list[num]);
      if(!Blockchain.verifyAddress(address_list[num])){
           // The address is not valid
        console.log("Address not valid:"+address_list[num]);
        // var result = Blockchain.transfer(Blockchain.transaction.from,total_amount);
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
      total_amount = total_amount.minus(each_amount);
      if(total_amount.lt(0)){
          throw new Error("Invalid balance, rollback");
      }
      var result = Blockchain.transfer(address_list[num],each_amount);
      console.log("Transfer status for:"+address_list[num]+" : "+result);
      if(result){
        console.log("Balance Remaining: "+total_amount.toString());
      }
      else {
        throw new Error("Transaction failed. Rollback");

      }
    }
    if(total_amount.gt(0)){
      // Still some balance left, send back to sender.
      var result = Blockchain.transfer(Blockchain.transaction.from,total_amount);
      if(result){
        console.log("Sent remaining back to sender: "+total_amount.toString());
      }
      else {
        throw new Error("Transaction failed. Rollback");
      }

    }

  },

  custom_distribute: function (address_list,amount_list) {
    // deposit money into multiple address with desired amount.
    // If, for some reason, some deposit failed (For example bad address), we should still allow the user to retain the balance from his account.
    // Need to check if throw function will rollback transfer action.
    // Check if it's a array
    if(!Array.isArray(address_list) || !Array.isArray(amount_list)){
      throw new Error("Invalid Input: Input need to be a array");
    }
    
    if(address_list.length!==amount_list.length){
        throw new Error("Invalid Input: address list need to match price");

    }

    var total_amount = new BigNumber(Blockchain.transaction.value);
    if(total_amount.lte(0)){
      throw new Error("Need to transfer NAS in order to do split distribute");
    }
    // Check balance here. Just make sure that the transaction is enough for distribute.
    var total_needed= new BigNumber(0);
    for(var i=0;i<amount_list.length;i++){
        total_needed = total_needed.plus(amount_list[i]);
    }
    if(total_needed.gt(Blockchain.transaction.value)){
        throw new Error("Not enough balance!");
    }
    // Check balance complete

    var number = address_list.length;
    console.log(address_list);
    console.log(address_list.length);
    console.log("Address from: "+Blockchain.transaction.from);
    // console.log("Testing code: ");
    // var test_amount=new BigNumber(88);
    // Blockchain.transfer("n1Y9JLyHUdHqFTvZD9S2a5acx6vsPeTHFCJ",test_amount)
    // console.log("Test End");
    // In order to work, first, validate all address input, if invalid, throw exception and return money.
    var num =0;

    for (num=0;num<address_list.length;num++) {
      console.log("Address to transfer:"+address_list[num]);
      if(!Blockchain.verifyAddress(address_list[num])){
           // The address is not valid
        console.log("Address not valid:"+address_list[num]);
        // var result = Blockchain.transfer(Blockchain.transaction.from,total_amount);
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
      total_amount = total_amount.minus(amount_list[num]);
      if(total_amount.lt(0)){
        throw new Error("Invalid balance, rollback");
      }
      var result = Blockchain.transfer(address_list[num],amount_list[num]);
      console.log("Transfer status for:"+address_list[num]+" : "+result);
      if(result){
        console.log("Balance Remaining: "+total_amount.toString());
      }
      else {
        throw new Error("Transaction failed. Rollback");

      }
    }

    if(total_amount.gt(0)){
      // Still some balance left, send back to sender.
      var result = Blockchain.transfer(Blockchain.transaction.from,total_amount);
      if(result){
        console.log("Sent remaining back to sender: "+total_amount.toString());
      }
      else {
        throw new Error("Transaction failed. Rollback");
      }

    }


  },

  // Now we need to forbid normal deposit to prevent funds lost
    accept: function(){      
        // This is the feature in 1.0.2. Not supported yet.

        throw new Error("We Do not support deposit.");
    }


};
module.exports = BatchDistribute;
