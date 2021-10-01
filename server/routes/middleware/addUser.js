const UserModel = require("../../models/User");

const addUser = async function (req, res) {
	try {
		const { username, email, password, userType } = req.body;

		// console.log(req.body);

		// Validate User input
		if (typeof username === "undefined" || username === null) {
			res.status(203).send({ message: "Please send name of User" });
			return;
		}
		if (typeof email === "undefined" || email === null) {
			res.status(203).send({ message: "Please send mail of User" });
			return;
		}
		if (typeof password === "undefined" || password === null) {
			res.status(203).send({ message: "Please send password of User" });
			return;
		}
		if (typeof userType === "undefined" || userType === null) {
			res.status(203).send({ message: "Please send userType of User" });
			return;
		}

		// Create user in our database
		let user = UserModel();
		user.username = username;
		user.email = email;
		user.password = password;
		user.userType = userType;

		// console.log(user);
		user.save((err, result) => {
			if (!err) {
				res.status(201).send(result);
			} else {
				res.status(203).send(err);
			}
		});
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
};

module.exports = addUser;
