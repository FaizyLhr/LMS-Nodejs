const router = require("express").Router();

const addAuthor = require("../middleware/addAuthor");

const AuthorModel = require("../../models/Authors");

//View authors
router.get("/authors", (req, res) => {
	AuthorModel.find({})
		.limit(20)
		.then((authors) => {
			res.status(200).send(authors);
		})
		.catch((err) => res.status(500).send(err));
});

// View Specific author
router.get("/author/:authorSlug", (req, res) => {
	AuthorModel.findOne({ slug: req.params.authorSlug })
		.then((author) => {
			if (author) {
				res.status(200).send(author);
			} else {
				res.status(402).send("No Author Found");
			}
		})
		.catch((err) => res.status(500).send(err));
});

{
	// //add User
	// router.post("/addUser", addAuthor);
	// //update User
	// router.put("/updateUser/:userSlug", async (req, res) => {
	// 	// console.log(req.params.userSlug);
	// 	AuthorModel.findOne({ slug: req.params.userSlug })
	// 		.then((updateUser) => {
	// 			// console.log(updateUser);
	// 			// console.log(req.body);
	// 			if (typeof req.body.username !== "undefined") {
	// 				updateUser.username = req.body.username;
	// 			}
	// 			if (typeof req.body.email !== "undefined") {
	// 				updateUser.email = req.body.email;
	// 			}
	// 			if (typeof req.body.userType !== "undefined") {
	// 				updateUser.userType = req.body.userType;
	// 			}
	// 			if (typeof req.body.password !== "undefined") {
	// 				res.status(502).send("you can't update your password");
	// 			}
	// 			// console.log(updateUser);
	// 			updateUser
	// 				.save()
	// 				.then((user) => {
	// 					res.status(200).send(user);
	// 				})
	// 				.catch((err) => {
	// 					res.status(403).send(err);
	// 				});
	// 		})
	// 		.catch((err) => {
	// 			res.status(500).send(err);
	// 		});
	// });
	// // delete User
	// router.delete("/delUser/:userSlug", async (req, res) => {
	// 	AuthorModel.findOne({ slug: req.params.userSlug })
	// 		.then((delUser) => {
	// 			if (!delUser) {
	// 				return res.sendStatus(401);
	// 			}
	// 			delUser
	// 				.remove()
	// 				.then((user) => {
	// 					res.status(200).send(user);
	// 				})
	// 				.catch((err) => {
	// 					res.status(403).send(err);
	// 				});
	// 		})
	// 		.catch((err) => {
	// 			res.status(500).send(err);
	// 		});
	// 	// res.status(200).send(delUser);
	// });
}

module.exports = router;
