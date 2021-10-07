// const jwt = require("jsonwebtoken");

const TOKEN_KEY = "faizy";

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
	if (
		typeof req.headers.authorization === "undefined" ||
		req.headers.authorization === null
	) {
		res.status(401).send("You are not logged in");
	}
	var token = req.headers.authorization.split(" ");
	if (typeof token[1] === "undefined" || typeof token[1] === null) {
		res.status(400).send("You are not logged in");
	} else {
		jsonwebtoken.verify(token[1], TOKEN_KEY, (err, data) => {
			if (err) {
				res.status(401).send(err);
			} else {
				req.user = data.user;
				next();
			}
		});
	}
};

module.exports = {
	isAdmin,
	isUser,
	isToken,
};
