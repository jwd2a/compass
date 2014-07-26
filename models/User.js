var mongoose = require("mongoose");
var rand = require("randomstring");

var userSchema = new mongoose.Schema({
	email: String,
	password: {type: String, select: false},
	apiKey: String,
	createdAt: Date,
	updatedAt: Date
});

userSchema.pre("save", function(next){
    this.apiKey = rand.generate();	
	next();
});


exports.model = mongoose.model("User", userSchema);

