var db = require("../public/js/db").db;
var User = require("../models/User").model;
var util = require("../public/js/util");

exports.create = function(req, res){

	User.find({email:req.body.email}, function(err, results){
		if(err){
			res.send(err);
		}else{
			if(results.length == 0){
				util.hashPassword(req.body.password, function(hash){
					var newUser = new User({
						email: req.body.email,
						password: hash,
					});

					newUser.save(function(err, user){
						if(err){
							res.send(err);
						}else{
							res.send(200,user);
						}
					});


				});
			}else{
				res.send("Sorry, that email is already registered");
			}
		}
	});

}

