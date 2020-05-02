var mongoose = require("mongoose");
var localMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	userName: String,
	password: String,
	desc: String,
	version: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Version"
		}
	],
	project: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project"
		}
	]
});

userSchema.plugin(localMongoose);

module.exports = mongoose.model("User", userSchema);