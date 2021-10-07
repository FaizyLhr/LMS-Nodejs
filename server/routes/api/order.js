const router = require("express").Router();

const addOrder = require("../middleware/addOrder");

const OrderModel = require("../../models/Orders");
const UserModel = require("../../models/User");
const BookModel = require("../../models/Books");

const { isAdmin, isUser, isToken } = require("../auth");

const calculateFine = require("../middleware/calculateFine");

router.param("bookSlug", (req, res, next, slug) => {
	BookModel.findOne({ slug })
		.then((book) => {
			if (!book) {
				return res.sendStatus(204);
			}

			req.book = book;

			return next();
		})
		.catch(next);
});

router.param("orderSlug", (req, res, next, slug) => {
	OrderModel.findOne({ slug })
		.then((order) => {
			if (!order) {
				return res.sendStatus(204);
			}

			req.order = order;

			return next();
		})
		.catch(next);
});

{
	// //View orders
	// router.get("/orders", (req, res) => {
	// 	OrderModel.find()
	// 		.limit(20)
	// 		.then((orders) => {
	// 			res.status(200).send(orders);
	// 		})
	// 		.catch((err) => res.status(500).send(err));
	// });
}

// View Specific order
router.get("/order/:orderSlug", isToken, isUser, (req, res) => {
	if (
		typeof req.params.orderSlug === "undefined" ||
		req.params.orderSlug === null
	) {
		res.status(203).send({ message: "Please send slug of order" });
		return;
	}
	OrderModel.findOne({ slug: req.params.orderSlug })
		.populate("bookID", "title ISBN")
		.populate("userID")
		.exec((err, order) => {
			console.log(err, order);
			if (!err && order !== null) {
				res.status(200).send(order);
			} else {
				res.status(203).send({ message: "No record found" });
			}
		});
	// .then((order) => {
	// 	if (order) {
	// 		res.status(200).send(order);
	// 	} else {
	// 		res.status(402).send("No order Found");
	// 	}
	// })
	// .catch((err) => res.status(500).send(err));
});

// View Details of Order
router.get(
	"/viewOrderDetails/:orderSlug",
	isToken,
	isUser,
	calculateFine,
	(req, res) => {
		// console.log(req.order);
		res.json({
			issuedDate: req.order.issuedDate,
			expiryDate: req.order.expiryDate,
			fine: req.order.fine,
		});
		// res.send(`Issued date is ${req.order.issuedDate}
		// Expiry Date is ${req.order.expiryDate}
		// 		Total Fine is ${req.order.fine}`);
	}
);

{
	// //View orders By UserName
	// router.get("/:userSlug/:bookSlug/orders", (req, res) => {
	// 	OrderModel.find({ userID: req.user._id })
	// 		.limit(20)
	// 		.then((orders) => {
	// 			res.status(200).send(orders);
	// 		})
	// 		.catch((err) => res.status(500).send(err));
	// });
	// // View Specific order By specific user
	// router.get("/:userSlug/:bookSlug/order/:orderSlug", (req, res) => {
	// 	if (
	// 		typeof req.params.orderSlug === "undefined" ||
	// 		req.params.orderSlug === null
	// 	) {
	// 		res.status(203).send({ message: "Please send slug of order" });
	// 		return;
	// 	}
	// 	OrderModel.findOne({
	// 		$and: [({ slug: req.params.orderSlug }, { userID: req.user._id })],
	// 	})
	// 		.populate("bookID", "title ISBN")
	// 		.populate("userID")
	// 		.exec((err, order) => {
	// 			console.log(err, order);
	// 			if (!err && order !== null) {
	// 				res.status(200).send(order);
	// 			} else {
	// 				res.status(203).send({ message: "No record found" });
	// 			}
	// 		});
	// 	// .then((order) => {
	// 	// 	if (order) {
	// 	// 		res.status(200).send(order);
	// 	// 	} else {
	// 	// 		res.status(402).send("No order Found");
	// 	// 	}
	// 	// })
	// 	// .catch((err) => res.status(500).send(err));
	// });
}
//add Order
router.post("/addOrder/:bookSlug", isToken, addOrder);

{
	// //update Order
	// router.put(
	// 	"/:userSlug/:bookSlug/updateOrder/:orderSlug",
	// 	async (req, res) => {
	// 		// console.log(req.params.userSlug);
	// 		OrderModel.findOne({
	// 			$and: [({ slug: req.params.orderSlug }, { userID: req.user._id })],
	// 		})
	// 			.then((updateOrder) => {
	// 				// console.log(updateUser);
	// 				// console.log(req.body);
	// 				if (typeof req.body.shippingAddress !== "undefined") {
	// 					updateOrder.shippingAddress = req.body.shippingAddress;
	// 				}
	// 				// console.log(updateOrder);
	// 				updateOrder
	// 					.save()
	// 					.then((order) => {
	// 						res.status(200).send(order);
	// 					})
	// 					.catch((err) => {
	// 						res.status(403).send(err);
	// 					});
	// 			})
	// 			.catch((err) => {
	// 				res.status(500).send(err);
	// 			});
	// 	}
	// );
	// // delete Order
	// router.delete(
	// 	"/:userSlug/:bookSlug/delOrder/:orderSlug",
	// 	async (req, res) => {
	// 		OrderModel.findOne({
	// 			$and: [({ slug: req.params.orderSlug }, { userID: req.user._id })],
	// 		})
	// 			.then((delOrder) => {
	// 				if (!delOrder) {
	// 					return res.sendStatus(401);
	// 				}
	// 				// console.log(delOrder);
	// 				delOrder
	// 					.remove()
	// 					.then((order) => {
	// 						res.status(200).send(order);
	// 					})
	// 					.catch((err) => {
	// 						res.status(403).send(err);
	// 					});
	// 			})
	// 			.catch((err) => {
	// 				res.status(500).send(err);
	// 			});
	// 		// res.status(200).send(delOrder);
	// 	}
	// );
}

//View orders By Admin
router.get("/viewOrders", isToken, isAdmin, (req, res) => {
	OrderModel.find()
		.limit(20)
		.then((orders) => {
			res.status(200).send(orders);
		})
		.catch((err) => res.status(500).send(err));
});

module.exports = router;
