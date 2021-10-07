const UserModel = require("../../models/User");
var emailService = require("../../utilities/emailService");

const addUser = async function (req, res) {
	try {
		const { username, email, password, userType } = req.body;

		// console.log(req.body);

		// Validate User input
		if (typeof username === "undefined" || username === null) {
			res.status(203).send({ message: "Please send username of User" });
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
		user.setOTP();

		// console.log(user);
		user.save((err, result) => {
			if (err) {
				res.status(400).send(err);
			} else {
				// console.log(result);
				// console.log(user);
				emailService.sendEmailVerificationOTP(result);
				res.status(201).send({
					message:
						"SignUp successfully an OTP sent to your email please verify your email address",
				});
			}
		});
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
};

module.exports = addUser;
