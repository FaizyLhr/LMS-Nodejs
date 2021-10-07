const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const TOKEN_KEY = "Faizy";

function isAdmin(req, res, next) {
	// console.log("admin");
	// console.log(req.user);
	if (!req.user) {
		// console.log("chk");
		return res.send("No User Found");
	}
	if (!(req.user.userType === 1)) {
		// console.log("Not Admin");
		res.status(403);
		return res.send("Access Denied");
	}
	// console.log(req.user);
	next();
}

function isUser(req, res, next) {
	// console.log(req.user);
	if (!req.user) {
		return res.send("No User Found");
	}
	if (!(req.user.userType === 2)) {
		res.status(403);
		return res.send("Access Denied");
	}
	next();
}

const isToken = function (req, res, next) {
	// console.log(req.headers.authorization);
	if (
		typeof req.headers.authorization === "undefined" ||
		req.headers.authorization === null
	) {
		return res.status(401).send("You are not logged in");
	}
	var token = req.headers.authorization.split(" ");
	// console.log(token[1]);
	if (typeof token[1] === "undefined" || typeof token[1] === null) {
		res.status(400).send("You are not logged in");
	} else {
		jwt.verify(token[1], TOKEN_KEY, (err, data) => {
			console.log(data.email);
			if (err) {
				res.status(401).send(err);
			} else {
				UserModel.findOne({ email: data.email })
					.then((user) => {
						// console.log(user);
						req.user = user;
						// console.log(req.user);
						next();
					})
					.catch((err) => next(err));
			}
		});
	}
};

module.exports = {
	isAdmin,
	isUser,
	isToken,
};
