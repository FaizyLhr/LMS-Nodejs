const router = require("express").Router();

const passport = require("passport");

const addUser = require("../middleware/addUser");

const { isAdmin, isUser, isToken } = require("../auth");
var emailService = require("../../utilities/emailService");

const UserModel = require("../../models/User");

// Acquiring Passport
const localStrategy = require("../../utilities/passport");

passport.use(localStrategy);
router.use(passport.initialize());

router.param("email", (req, res, next, email) => {
	UserModel.findOne({ email }, (err, user) => {
		if (!err && user !== null) {
			req.emailUser = user;
			return next();
		}
		res.status(401).send("User not found!");
	});
});

// Signup
router.post("/signUp", addUser);

// verifyOTP
router.post("/otp/verify", (req, res, next) => {
	if (!req.body.email && req.body.otp) {
		res.status(203).send({ message: "Missing credentials" });
	}

	let query = {
		email: req.body.email,
		otp: req.body.otp,
		otpExpires: { $gt: Date.now() },
	};

	console.log(query);

	UserModel.findOne(query, function (err, user) {
		if (err || !user) {
			res.status(401).send({ message: "Invalid OTP" });
		} else {
			user.otp = null;
			user.otpExpires = null;
			if (req.body.type === 1) {
				user.isEmailVerified = true;
				console.log("user is verified");
			} else {
				user.generatePasswordRestToken();
			}
			user.save().then(function () {
				if (req.body.type === 1) {
					res.send(user.toAuthJSON());
				} else if (req.body.type === 2) {
					res.send({ passwordRestToken: user.passwordRestToken });
				}
			});
		}
	});
});

// Resend OTP
router.get("/otp/resend/:email", (req, res, next) => {
	req.emailUser.setOTP();
	req.emailUser.save((err, user) => {
		emailService.sendEmailVerificationOTP(req.emailUser);
		res.status(200).send({
			message: "OTP sent Successfully to registered email address",
		});
	});
});

router.post("/reset/password/:email", (req, res, next) => {
	if (req.body.passwordRestToken !== req.emailUser.passwordRestToken) {
		return next(res.status(401).send(`Invalid Password Reset Token`));
	}

	req.emailUser.setPassword(req.body.password);

	req.emailUser.save((err, user) => {
		res.send(user.toAuthJSON());
	});
});

// login
router.post(
	"/login",
	(req, res, next) => {
		console.log("api");
		next();
	},
	passport.authenticate("local", { session: false }),
	(req, res) => {
		// console.log("req");
		// console.log(req.user);
		if (!req.user.isEmailVerified) {
			res.status(401).send("Your Email is not verified");
		}

		res.status(200).send(req.user.toAuthJSON());
		res.status(200).send(req.user);
	}
);

router.param("userSlug", (req, res, next, slug) => {
	UserModel.findOne({ slug })
		.then((user) => {
			if (!user) {
				return res.sendStatus(204);
			}

			req.user = user;
			// console.log(req.user);

			return next();
		})
		.catch(next);
});

// View Specific User
router.get("/:userSlug/viewUser", isUser, (req, res) => {
	UserModel.findOne({ slug: req.params.userSlug })
		.then((user) => {
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
});

//update User
router.put("/:userSlug/updateUser", isUser, async (req, res) => {
	// console.log(req.params.userSlug);
	UserModel.findOne({ slug: req.params.userSlug })
		.then((updateUser) => {
			// console.log(updateUser);
			// console.log(req.body);

			if (typeof req.body.username !== "undefined") {
				updateUser.username = req.body.username;
			}
			if (typeof req.body.email !== "undefined") {
				updateUser.email = req.body.email;
			}
			if (typeof req.body.userType !== "undefined") {
				updateUser.userType = req.body.userType;
			}
			if (typeof req.body.password !== "undefined") {
				res.status(502).send("you can't update your password");
			}
			// console.log(updateUser);

			updateUser
				.save()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((err) => {
					res.status(403).send(err);
				});
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// delete User
router.delete("/:userSlug/delUser", isUser, async (req, res) => {
	UserModel.findOne({ slug: req.params.userSlug })
		.then((delUser) => {
			if (!delUser) {
				return res.sendStatus(401);
			}

			delUser
				.remove()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((err) => {
					res.status(403).send(err);
				});
		})
		.catch((err) => {
			res.status(500).send(err);
		});

	// res.status(200).send(delUser);
});

//View All Users By Admin
router.get("/:userSlug/users", isAdmin, (req, res) => {
	UserModel.find({})
		.limit(20)
		.then((users) => {
			res.status(200).send(users);
		})
		.catch((err) => res.status(500).send(err));
});

// View Specific User By Admin
router.get("/:userSlug/viewUser/:user", isAdmin, (req, res) => {
	UserModel.findOne({ slug: req.params.user })
		.then((user) => {
			res.status(200).send(user);
		})
		.catch((err) => res.status(500).send(err));
});

//add User By Admin
router.post("/:userSlug/addUser", isAdmin, addUser);
// router.post("/addUser", addUser);

//update User By Admin
router.put("/:userSlug/updateUser/:user", isAdmin, async (req, res) => {
	// console.log(req.params.userSlug);
	UserModel.findOne({ slug: req.params.user })
		.then((updateUser) => {
			// console.log(updateUser);
			// console.log(req.body);

			if (typeof req.body.username !== "undefined") {
				updateUser.username = req.body.username;
			}
			if (typeof req.body.email !== "undefined") {
				updateUser.email = req.body.email;
			}
			if (typeof req.body.userType !== "undefined") {
				updateUser.userType = req.body.userType;
			}
			if (typeof req.body.password !== "undefined") {
				res.status(502).send("you can't update your password");
			}
			// console.log(updateUser);

			updateUser
				.save()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((err) => {
					res.status(403).send(err);
				});
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

// delete User By Admin
router.delete("/:userSlug/delUser/:user", isAdmin, async (req, res) => {
	UserModel.findOne({ slug: req.params.user })
		.then((delUser) => {
			if (!delUser) {
				return res.sendStatus(401);
			}

			delUser
				.remove()
				.then((user) => {
					res.status(200).send(user);
				})
				.catch((err) => {
					res.status(403).send(err);
				});
		})
		.catch((err) => {
			res.status(500).send(err);
		});

	// res.status(200).send(delUser);
});

module.exports = router;
