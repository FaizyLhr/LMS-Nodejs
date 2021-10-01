const mongoose = require("mongoose");
const slug = require("slug");

const OrderSchema = new mongoose.Schema(
	{
		slug: { type: String, unique: true, required: true, trim: true },
		issuedDate: {
			type: Date,
			default: Date.now,
		},
		expiryDate: {
			type: Date,
			default: new Date(+Date.now() + 5 * 24 * 60 * 60 * 1000),
		},
		shippingAddress: {
			city: String,
			phone: String,
			address: { type: String, lowercase: true, trim: true },
		},
		bookID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
		userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

OrderSchema.pre("validate", function (next) {
	if (!this.slug) {
		this.slugify();
	}
	next();
});

OrderSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

module.exports = mongoose.model("Order", OrderSchema);
