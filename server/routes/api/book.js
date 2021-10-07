const router = require("express").Router();

const addBook = require("../middleware/addBook");

const BookModel = require("../../models/Books");
const UserModel = require("../../models/User");

const { isAdmin, isUser, isToken } = require("../auth");

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

// View Specific book
router.get("/:userSlug/book/:bookSlug", isUser, (req, res) => {
	BookModel.findOne({ slug: req.params.bookSlug })
		.populate("author")
		.exec((err, book) => {
			// console.log(err, book);
			if (!err && book !== null) {
				res.status(200).send(book);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
});

// Search Books By Title
router.get("/:userSlug/searchBook/:title", isUser, (req, res) => {
	console.log(req.params.title);
	BookModel.findOne({ title: req.params.title })
		.populate("author")
		.exec((err, book) => {
			// console.log(err, book);
			if (!err && book !== null) {
				res.status(200).send(book);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
});

//View books By Admin
router.get("/:userSlug/books", isAdmin, (req, res) => {
	BookModel.find({})
		.limit(20)
		.populate("author")
		.exec((err, book) => {
			// console.log(err, book);
			if (!err && book !== null) {
				res.status(200).send(book);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
});

// View Specific book By Admin
router.get("/:userSlug/viewBook/:bookSlug", isAdmin, (req, res) => {
	BookModel.findOne({ slug: req.params.bookSlug })
		.populate("author")
		.exec((err, book) => {
			// console.log(err, book);
			if (!err && book !== null) {
				res.status(200).send(book);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
});

//add Book By Admin
router.post("/:userSlug/addBook", isAdmin, addBook);

//update Book By Admin
router.put("/:userSlug/updateBook/:book", isAdmin, async (req, res) => {
	// console.log(req.user);
	BookModel.findOne({ slug: req.params.book })
		.then((updateBook) => {
			// console.log(updateBook);
			console.log(req.body);

			if (typeof req.body.genre !== "undefined") {
				updateBook.genre = req.body.genre;
			}
			if (typeof req.body.title !== "undefined") {
				updateBook.title = req.body.title;
			}
			if (typeof req.body.ISBN !== "undefined") {
				updateBook.ISBN = req.body.ISBN;
			}

			// console.log(updateBook);

			updateBook
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

// delete Book By Admin
router.delete("/:userSlug/delBook/:book", isAdmin, async (req, res) => {
	BookModel.findOne({ slug: req.params.book })
		.then((delBook) => {
			if (!delBook) {
				return res.sendStatus(401);
			}

			delBook
				.remove()
				.then((book) => {
					res.status(200).send(book);
				})
				.catch((err) => {
					res.status(403).send(err);
				});
		})
		.catch((err) => {
			res.status(500).send(err);
		});

	// res.status(200).send(delBook);
});

// Search Books By Title By Admin
router.get("/:userSlug/search/:title", isAdmin, (req, res) => {
	console.log(req.params.title);
	BookModel.findOne({ title: req.params.title })
		.populate("author")
		.exec((err, book) => {
			// console.log(err, book);
			if (!err && book !== null) {
				res.status(200).send(book);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
});

module.exports = router;
