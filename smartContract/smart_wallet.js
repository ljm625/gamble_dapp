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
        this.owner=Blockchain.transaction.from;
        this.period = 10000;
        this._keepAlive();
        // console.log(this.balance);

    },

    // The idea of smart wallet is, u can create a personal smart wallet that it will store money into the account.
    // You need to interact each "time-period", if u failed to do so, it will be transfered to the safe wallet/friend's wallet you defined in the smart contract.

    deposit: function (){
        // Deposit nas into the smart wallet.
        this.balance.plus(Blockchain.transaction.value);
        if(Blockchain.transaction.from == this.owner){
            this._keepAlive();
        }
        console.log("The new balance is : "+this.balance.toString());
    },

    setInterval: function(interval){
        // Set the interval to release fund.
        if(typeof(interval)!=="number"){
            throw new Error("Invalid Input. Numbers required.");
        }
        if(Blockchain.transaction.from == this.owner){
            this._keepAlive();
            this.period = interval;
        }

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

    withdraw: function(amount){
        if(Blockchain.transaction.from == this.owner){
            this._keepAlive();
            // Start check amount
            if (amount==null){
                // Release all
                var to_withdraw = this.balance;
                this.balance = new BigNumber(0);
                var result = Blockchain.transfer(BLockchain.transaction.from,to_withdraw);
                if(!result){
                    // WTF
                    throw new Error("Transaction failed.");
                }
            }
            else{
                if(this.balance.lt(amount)){
                    throw new Error("Not enough balance");
                }
                else{
                    var to_withdraw = new BigNumber(amount);
                    this.balance.minus(amount);
                    // Minus before transaction to avoid recursive calls.
                    var result = Blockchain.transfer(BLockchain.transaction.from,to_withdraw);
                    if(!result){
                        // WTF
                        throw new Error("Transaction failed.");
                    }
                }
            }
        }
        else{
            throw new Error("Not Authorized.");
        }
    },

    // Now we need to forbid normal deposit to prevent funds lost
    accept: function(){      
        // This is the feature in 1.0.2. Not supported yet.
                // Deposit nas into the smart wallet.
                this.balance.plus(Blockchain.transaction.value);
                if(Blockchain.transaction.from == this.owner){
                    this._keepAlive();
                }
                console.log("The new balance is : "+this.balance.toString());
        
    }


};
module.exports = SmartWallet;
