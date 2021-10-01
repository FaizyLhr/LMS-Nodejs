const OrderModel = require("../../models/Orders");

const addOrder = async function (req, res) {
	// try {
	let totalOrdered;
	let countOrdered;
	OrderModel.count({}, function (err, count) {
		countOrdered = count;
		// console.log("Number of users:", count);
	});
	const { shippingAddress } = req.body;

	// Validate order input
	if (typeof shippingAddress === "undefined" || shippingAddress === null) {
		res.status(203).send({ message: "Please send shippingAddress" });
		return;
	}

	// Create order in our database
	let order = OrderModel();
	order.shippingAddress = shippingAddress;
	order.bookID = req.book._id;
	order.userID = req.user._id;

	order.save((err, result) => {
		if (!err) {
			res.status(201).send(result);
		} else {
			res.status(203).send(err);
		}
	});
	totalOrdered++;
	countOrdered--;
	// } catch (e) {
	// 	console.log(e);
	// 	res.status(500).send(e);
	// }
};

module.exports = addOrder;
