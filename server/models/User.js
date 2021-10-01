const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const slug = require("slug");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "Faizy";

const UserSchema = new mongoose.Schema({
	slug: { type: String, unique: true, required: false, trim: true },

	username: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
	},
	userType: {
		type: Number,
		required: true,
		default: 2,
		enum: [1, 2], //1-admin 2-Student
	},
	password: { type: String, minLength: 4, trim: true },
	token: { type: String },
});

UserSchema.pre("save", function (next) {
	let user = this;
	// console.log(user);
	// console.log("log");

	if (!user.isModified("password")) {
		return next();
	}

	// salt Generation
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		// Hash Generation

		//Two Methods

		//1-Using Promise
		bcrypt
			.hash(user.password, salt)
			.then((complex) => {
				user.password = complex;
				next();
			})
			.catch((e) => {
				return next(err);
			});

		//2-Using Sync Function
		// bcrypt.hash(user.password, salt, function (err, hash) {
		// 	if (err) return next(err);
		// 	// override the cleartext password with the hashed one
		// 	user.password = hash;
		// 	next();
		// });
	});
});

UserSchema.methods.comparePass = function (pass) {
	bcrypt
		.compare(pass, this.password)
		.then((val) => {
			return val;
		})
		.catch((err) => {
			return err;
		});
};

UserSchema.pre("validate", function (next) {
	// console.log(this);
	if (!this.slug) {
		this.slugify();
		// console.log(typeof this.slugify());
	}
	next();
});

UserSchema.methods.slugify = function () {
	this.slug = slug(((Math.random() * Math.pow(36, 6)) | 0).toString(36));
};

UserSchema.methods.getToken = function () {
	jwt.sign(
		{ user: this.email },
		secretKey,
		{ expiresIn: "1h" },
		(err, result) => {
			if (err) return err;

			this.token = result;
		}
	);
};

// UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
