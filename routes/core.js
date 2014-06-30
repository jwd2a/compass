var http = require("superagent");
var twitter = require("twit");
var _ = require("underscore");
var async = require("async");
var mandrill = require("mandrill-api/mandrill");
var linkedin = require("node-linkedin")("7568f64x1j4igl","wSQ2EHpmoln8EiRp","");
var fc_response;

//set up twitter

var T = new twitter({
	consumer_key:		"LnrnWAYpLerjPfLzRzkgNoiuc",
	consumer_secret:	"4XTl9ExNYvUzblIsTl7Xa4iBILA2QnkXanH4fwQKzwPYZeSPll",
	access_token:		"1668721-wOwbQxELEDogieibo1Zcg4kJGltji7Obw0ukblzOgL",
	access_token_secret: "qIBQqI0PYcRXUXnI9tm7mvymdudHU7vASeJOoM6vms82k"
});

//set up full contact

var fc_apiKey = "c6cd7256082432c9";
var fc_apiUrl = "https://api.fullcontact.com/v2/person.json?";

//set up mandrill

var Mandrill = new mandrill.Mandrill("p1swUYDPhBnKB1aZNmTl6w");



exports.lookup = function(req, res){

	var url = buildApiUrl(req.query.email);
	http.get(url).end(function(response){
		fc_response = response;
		async.parallel({
			twitter: getTwitterInfo
		},
			sendEmail
		);
	});
};

function getTwitterInfo(cb){
	var twit = _.findWhere(fc_response.body.socialProfiles, {type:"twitter"});
	T.get(
		"users/show",
		{"screen_name":twit.username},
		function(err, data, resp){
			cb(err, data);
		});
}

function getLinkedInInfo(cb){
	var linked = _.findWhere(fc_response.body.socialProfiles, {type:"linkedin"});

	if(linked){
		var L = linkedin.init("2c0733f9-9d2a-42af-bf32-56fe240f4556");	
		L.people.url(linked.url, function(err, results){
			console.log(err);
			console.log(results);
		});
	}
}

function buildApiUrl(email){
	return fc_apiUrl + "email="+email +"&apiKey="+fc_apiKey;
}

function sendEmail(err, results){

	var first_name = fc_response.body.contactInfo.givenName;
	var last_name = fc_response.body.contactInfo.familyName;

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
		global_merge_vars : [
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
				name: "KTOPIC1",
				content:fc_response.body.digitalFootprint.topics[0].value
			},
			{
				name: "KTOPIC2",
				content:fc_response.body.digitalFootprint.topics[1].value
			},
			{
				name: "KTOPIC3",
				content: fc_response.body.digitalFootprint.topics[2].value
			},
			{
				name: "USERNAME_TWITTER",
				content: results.twitter.screen_name
			},
			{
				name: "BIO_TWITTER",
				content: results.twitter.description
			},
			{
				name: "FOLLOWERS_TWITTER",
				content: results.twitter.followers_count
			}
		]	
	};


	Mandrill.messages.sendTemplate({
		template_name: "CompassDev",
		template_content: null,
		message: message
		}, function(result){
			console.log(result);
		}, function(err) {
			console.log(err);
		});
}
