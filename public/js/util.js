//Utilities

var bcrypt = require("bcrypt");

exports.hashPassword = function(password, callback){
	bcrypt.hash(password, 10, function(err, hash){
		if(!err){
			if(callback){
				callback(hash);
			}else{
				return hash;
			}
		}else{
			//error
		}
	});
}
