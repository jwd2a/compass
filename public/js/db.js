var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;

//handle error when connecting

db.on("error", function(){
	console.log("Error connecting to the database. Is mongodb running and the correct path set?");
});

db.on("open", function(){
	console.log("Connected and ready for business");
});

exports.db = db;
