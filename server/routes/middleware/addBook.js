const BookModel = require("../../models/Books");

const addBook = async function (req, res) {
	try {
		const { genre, title, ISBN } = req.body;

		// Validate Book input
		if (typeof genre === "undefined" || genre === null) {
			res.status(203).send({ message: "Please send genre" });
			return;
		}
		if (typeof title === "undefined" || title === null) {
			res.status(203).send({ message: "Please send title" });
			return;
		}
		if (typeof ISBN === "undefined" || ISBN === null) {
			res.status(203).send({ message: "Please send ISBN" });
			return;
		}

		// Create book in our database
		let book = BookModel();
		book.genre = genre;
		book.title = title;
		book.ISBN = ISBN;
		book.createdBy = req.user._id;

		// console.log(book);
		book.save((err, result) => {
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

module.exports = addBook;
