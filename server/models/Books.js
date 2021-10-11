const mongoose = require("mongoose");
const slug = require("slug");

const BookSchema = new mongoose.Schema(
	{
		genre: {
			type: String,
			lowercase: true,
			required: [true, "can't be blank"],
		},
		slug: { type: String, unique: true, required: true, trim: true },
		title: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
		},
		ISBN: { type: Number, requires: true, unique: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
	},
	{ timestamps: true }
);

BookSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

BookSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

module.exports = mongoose.model("Book", BookSchema);
