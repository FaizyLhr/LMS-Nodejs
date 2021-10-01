const jwt = require("jsonwebtoken");

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

function isLogin(req, res, next) {
	// console.log(req.user.token);
	const decodedUser = jwt.verify(req.user.token, TOKEN_KEY);
	if (!decodedUser) {
		return res.status(403).send("Invalid Credentials");
	}
	// console.log(decodedUser);
	next();
}

function isBlocked(req, res, next) {
	// console.log(req.user.userStatus);
	if (req.user.userStatus === true) {
		return res.status(500).send("User Already Blocked");
	}
	next();
}

function isUnBlocked(req, res, next) {
	// console.log(req.user.userStatus);

	// console.log(req.user);
	if (req.user.userStatus === false) {
		return res.status(503).send("User Already UnBlock");
	}
	next();
}

module.exports = {
	isAdmin,
	isUser,
	isLogin,
	isBlocked,
	isUnBlocked,
};
