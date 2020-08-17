var mongoose = require("mongoose");

var versionSchema = new mongoose.Schema({
	auther: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	desc: String,
	parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Version"
	},
	child: [ 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Version"
		}
	],
	content: String
});

module.exports = mongoose.model("Version", versionSchema);