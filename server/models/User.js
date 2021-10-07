const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const slug = require("slug");
var otpGenerator = require("otp-generator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");

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
	otp: String,
	otpExpires: Date,
	passwordRestToken: String,
	isEmailVerified: { type: Boolean, default: false },
	password: { type: String, minLength: 4, trim: true },
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
	let ans = bcrypt.compareSync(pass, this.password);
	if (ans) {
		// console.log("ans");
		// console.log(ans);
		return true;
	} else {
		// console.log("ans");
		// console.log(ans);
		return false;
	}
};

UserSchema.methods.setPassword = function (pass) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		// Hash Generation

		bcrypt
			.hash(pass, salt)
			.then((complex) => {
				this.password = complex;
				next();
			})
			.catch((e) => {
				return err;
			});
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

UserSchema.methods.generatePasswordRestToken = function () {
	this.passwordRestToken = crypto.randomBytes(48).toString("hex");
};

UserSchema.methods.setOTP = function () {
	this.otp = otpGenerator.generate(6, {
		upperCase: false,
		specialChars: false,
	});
	this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateToken = function () {
	return jwt.sign({ email: this.email }, secretKey, { expiresIn: "1h" });
};

UserSchema.methods.toAuthJSON = function () {
	return {
		username: this.username,
		slug: this.slug,
		email: this.email,
		userType: this.userType,
		isEmailVerified: this.isEmailVerified,
		password: this.password,
		token: this.generateToken(),
	};
};

// UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
