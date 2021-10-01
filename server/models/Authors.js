const mongoose = require("mongoose");
const slug = require("slug");

const AuthorSchema = new mongoose.Schema({
	slug: { type: String, unique: true, required: true, trim: true },
	first_name: {
		type: String,
		lowercase: true,
		required: [true, "can't be blank"],
		trim: true,
	},
	last_name: {
		type: String,
		lowercase: true,
		trim: true,
		required: [true, "can't be blank"],
	},
	areaOfInterest: {
		type: Number,
		required: true,
		default: 2,
		enum: [1, 2], //1-Web 2-Android
	},
});

AuthorSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

AuthorSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

module.exports = mongoose.model("Author", AuthorSchema);
