var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	auther: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	name: String,
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	content: String,
	star: Number
});

module.exports = mongoose.model("Comment", commentSchema);