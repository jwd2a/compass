//interfaces for social APIs

var twitter = require("twit");
var linkedin = require("node-linkedin")("7568f64x1j4igl","wSQ2EHpmoln8EiRp", function(arg){
	console.log(arg);
});

var jade = require("jade");

var T = new twitter({
	consumer_key:		"LnrnWAYpLerjPfLzRzkgNoiuc",
	consumer_secret:	"4XTl9ExNYvUzblIsTl7Xa4iBILA2QnkXanH4fwQKzwPYZeSPll",
	access_token:		"1668721-wOwbQxELEDogieibo1Zcg4kJGltji7Obw0ukblzOgL",
	access_token_secret: "qIBQqI0PYcRXUXnI9tm7mvymdudHU7vASeJOoM6vms82k"
});


//these interfaces take the specific social block from the Full Contact API and use the data in that block to make API calls to the respective services.

exports.getTwitter = function(response, cb){
	
	T.get("users/show",{"screen_name":response.username},function(err, data, resp){
		
		if(!err){
			jade.renderFile("public/components/emailTemplates/twitter.jade", data, function(err, html){
				if(!err){
					cb(null, html);
				}else{
					cb(err, null);
				}
			});
		}else{
			cb(err, null);
		}	

	});
}

exports.getLinkedIn = function(response, cb){

	var L = linkedin.init("e07806b5-38df-4674-be1b-7aae4c95004b");	
	L.people.url(response.url, function(err, results){
		console.log(err);
		console.log(results);
	});
}

exports.getFacebook = function(cb){
	console.log("get facebook");
	cb(err, data);
}

exports.getGoogle = function(cb){
	console.log("get google");
	cb(err, data);
}

exports.getGooglePlus = function(response, cb){
	if(response.bio){
		jade.renderFile("public/components/emailTemplates/googleplus.jade", response, function(err, html){
			if(!err){
				cb(null, html);
			}else{
				cb(err, null);
			}
		});
	}	
}
