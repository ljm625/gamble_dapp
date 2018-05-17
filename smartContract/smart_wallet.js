"use strict";

var SmartWallet = function () {
  LocalContractStorage.defineProperties(this, {
    owner: null,
    safe_address: null,
    secondary_address:null,
    period: null,
    last_alive_time: null,
  });
  LocalContractStorage.defineMapProperty(this, "balance", {
    stringify: function (obj) {
        return obj.toString();
    },
    parse: function (str) {
        return new BigNumber(str);
    }
  });
};

SmartWallet.prototype = {
  init: function () {
    console.log("test");
    console.log(Blockchain.transaction.from);
    // console.log(this.balance);

  },

  // The idea of smart wallet is, u can create a personal smart wallet that it will store money into the account.
  // You need to interact each "time-period", if u failed to do so, it will be transfered to the safe wallet/friend's wallet you defined in the smart contract.

  deposit: function (){
    // Deposit nas into the smart wallet.
    this.balance.plus(Blockchain.transaction.value);
    console.log("The new balance is : "+this.balance.toString());
  },

  setInterval: function(){
    // Set the interval to release fund.
  },

  _keepAlive: function(){
      // Keep alive by the wallet owner.
      // If deposit, it will automatically keep_alive
      this.last_alive_time = Date.now();
      console.log("Last alive time updated. Now:"+this.last_alive_time);
  },

  setSafeAddress: function(primary_address,secondary_address){
      // Set the safe address for the SmartWallet.
    if(Blockchain.transaction.from == this.owner){
        if(Blockchain.verifyAddress(primary_address)){
            this.safe_address = primary_address;
            console.log("Address updated:"+primary_address);
        }
        // this.secondary_address = secondary_address;
    }
  },

  releaseFund: function(){
      // Release fund
      if(this.period!= null){
        if(Date.now() - this.last_alive_time > this.period){
            var balance = this.balance;
            this.balance = new BigNumber(0);
            // Update balance before sending to aviod recursive calls
            Blockchain.transfer(this.primary_address,balance);
            console.log("Funds released");
        }

      }
  },

  // Now we need to forbid normal deposit to prevent funds lost
accept: function(){      
    // This is the feature in 1.0.2. Not supported yet.
}


};
module.exports = SmartWallet;