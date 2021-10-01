const router = require("express").Router();

const addUser = require("../middleware/addUser");

const { isAdmin, isUser, isLogin } = require("../../auth/auth");

const UserModel = require("../../models/User");

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
