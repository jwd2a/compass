var http = require("superagent");
var _ = require("underscore");
var async = require("async");
var mandrill = require("mandrill-api/mandrill");
var social = require("../public/js/socialInterfaces.js");
var fc_response;

//set up twitter


//set up full contact

var fc_apiKey = "c6cd7256082432c9";
var fc_apiUrl = "https://api.fullcontact.com/v2/person.json?";

//set up mandrill

var Mandrill = new mandrill.Mandrill("p1swUYDPhBnKB1aZNmTl6w");



exports.lookup = function(req, res){
	var url = buildApiUrl(req.query.email);
	http.get(url).end(function(response){
		fc_response = response;
		//buildTemplate();
		console.log(fc_response);
		res.send(fc_response.body.socialProfiles);
	});

}

function buildApiUrl(email){
	return fc_apiUrl + "email="+email +"&apiKey="+fc_apiKey;
}

function buildTopics(fc_responseBody){
	if(fc_responseBody.digitalFootprint.topics && fc_responseBody.digitalFootprint.topics.length > 0){
		var topicSentance = "They seem to be an expert in ";
		if (fc_responseBody.digitalFootprint.topics.length == 1){
			return topicSentance + fc_responseBody.digitalFootprint.topics[0].value;
		}
		if (fc_responseBody.digitalFootprint.topics.length > 1){
			var topics = "";
			_.each(fc_responseBody.digitalFootprint.topics, function(topic,index){
				if(index == fc_responseBody.digitalFootprint.topics.length-1){
					topics = topics +  "and "+topic.value;
				}else{
					topics = topics + topic.value + ", ";
				}
			});
			return topicSentance + topics;
		}
	}else{
		return null;
	}
}

function sendEmail(err, results){

	var first_name = fc_response.body.contactInfo.givenName;
	var last_name = fc_response.body.contactInfo.familyName;

	var global_vars = [
			{
				name: "FULLNAME",
				content: first_name + " " + last_name
			},
			{
				name: "FNAME",
				content: first_name
			},
			{
				name: "LOCATION",
				content: fc_response.body.demographics.locationGeneral
			},
			{
				name: "TOPICS",
				content: buildTopics(fc_response.body)
			},
			{
				name: "PHOTO",
				content: fc_response.body.photos[0].url
			}
		];

	global_vars.push({
		name: "BIO",
		content: getBio(fc_response.body)
	});

	var template_content = [];

	//add social content blocks

	_.each(results, function(profile,index){
		template_content.push({
			name: "block"+index,
			content: profile
		});
	});
	
	
	var message = {
		subject: "Meet " + first_name,
		from_email: "justin@maderalabs.com",
		from_name: "Compass Dev",
		to: [
			{
				email: "justin@maderalabs.com"
			}
		],
		important: "false",
		global_merge_vars : global_vars
	};


	Mandrill.messages.sendTemplate({
		template_name: "Compass Full",
		template_content: template_content,
		message: message
		}, function(result){
			console.log(result);
		}, function(err) {
			console.log(err);
		});

}

function buildTemplate(){
	var socialProfiles=[];
	_.each(fc_response.body.socialProfiles, function(profile){
		var func = assignFunction(profile);
		if(func){
			socialProfiles.push(func);
		}
	});
	
	async.parallel(socialProfiles, sendEmail);
}

function assignFunction(profile){
	
	var key = profile.type;

	if(key == "twitter"){
		return function(cb){
			social.getTwitter(profile, cb);
		}
	}
/*	if(key == "linkedin"){
		return function(cb){
			social.getLinkedIn(profile, cb);
		}
	}

	if(key == "googleplus"){
		return function(cb){
			social.getGooglePlus(profile, cb);
		}
	}

	return null;
/*	if(key == "facebook"){
		return social.getFacebook;
	}
	if(key == "googleprofile"){
		return social.getGoogle;
	}	
*/
}

function getBio(fc_responseBody){
	
}
