"use strict";

var DictItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.key = obj.key;
		this.value = obj.value;
		this.author = obj.author;
	} else {
	    this.key = "";
	    this.author = "";
	    this.value = "";
	}
};

DictItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var GambleGame = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new DictItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

GambleGame.prototype = {
    init: function () {
        // todo
        // Set the developer address
        this.repo.put("dev","n1Y9JLyHUdHqFTvZD9S2a5acx6vsPeTHFCJ");
        this.repo.put("fee","5");
        this.min=new BigNumber(0);

    },

    accept: function () {
        // deposit money into the game.

        // TODO: Disable multiple deposit.

        var par_list = this.repo.get("participant_list");
        var current_num = new BigNumber(this.repo.get("cur_number"));
        var target = new BigNumber(this.repo.get("target"));
        if (current_num.plus(Blockchain.transaction.value).plus(1) > target){
            // The Game is ended. Now start lucky chooser
            par_list[Blockchain.transaction.from]={start:current_num.plus(1).toString(), end: target.toString()};
            // refund the extra part first.
            var extra = target.minus(current_num);
            var refund = Blockchain.transaction.value.minus(extra);
            current_num = target;
            Blockchain.transfer(Blockchain.transaction.from,refund);

            var winner = Math.floor(Math.random() * (target+1));
            var winner_address=undefined;
            // Find the winner now
            for (var key in par_list) {
                if(par_list.hasOwnProperty(key)){
                    if(par_list.end <= winner && par_list.start >= winner){
                        // This is the winner
                        winner_address = key;
                        break;
                    }
                }
            }
            if(winner_address!== undefined){
                Blockchain.transfer()
            }
            


        }
        else{
            par_list[Blockchain.transaction.from]={start:current_num.plus(1).toString(), end: current_num.plus(Blockchain.transaction.value).plus(1).toString()};
            current_num = current_num.plus(1).plus(Blockchain.transaction.value);
            this.repo.put("cur_number", current_num.toString());
    
        }

        // Lucky number system : address, start_num, end_num
        key = key.trim();
        value = value.trim();
        if (key === "" || value === ""){
            throw new Error("empty key / value");
        }
        if (value.length > 64 || key.length > 64){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var dictItem = this.repo.get(key);
        if (dictItem){
            throw new Error("value has been occupied");
        }

        dictItem = new DictItem();
        dictItem.author = from;
        dictItem.key = key;
        dictItem.value = value;

        this.repo.put(key, dictItem);
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = SuperDictionary;