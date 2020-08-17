var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
	projectName: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	desc: String,
	version: [
		{
			auther: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			content: String
		}
	],
	bid: Number,
	currentBid: Number,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Project", projectSchema);