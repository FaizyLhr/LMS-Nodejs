const AuthorModel = require("../../models/Authors");

const addAuthor = async function (req, res) {
	try {
		const { first_name, last_name, areaOfInterest } = req.body;

		// Validate Author input
		if (typeof first_name === "undefined" || first_name === null) {
			res.status(203).send({ message: "Please send first_name" });
			return;
		}
		if (typeof last_name === "undefined" || last_name === null) {
			res.status(203).send({ message: "Please send last_name" });
			return;
		}
		if (typeof areaOfInterest === "undefined" || areaOfInterest === null) {
			res.status(203).send({ message: "Please send areaOfInterest" });
			return;
		}

		// Create author in our database
		let author = AuthorModel();
		author.first_name = first_name;
		author.last_name = last_name;
		author.areaOfInterest = areaOfInterest;

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

module.exports = addAuthor;
