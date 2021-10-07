const OrderModel = require("../../models/Orders");

const moment = require("moment");

const calculateFine = async function (req, res, next) {
	console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));

	let perDayFine = 5;

	let currentTime = moment().format("LT");
	let currentTimeDate = new Date().getTimezoneOffset();
	console.log("currentTime", currentTime);
	console.log("currentTimeDate", currentTimeDate.toString());

	let expiryDate = new Date(req.order.expiryDate);
	expiryTime = expiryDate.getTime();
	// console.log("expiryTime", expiryTime);

	let overTime = currentTime - expiryTime;
	// console.log(overTime);

	if (overTime > 0) {
		let cal = overTime / (1000 * 3600 * 24);
		// console.log(cal);

		let overDate = Math.ceil(cal);
		// console.log("OverDays", overDate);

		let fine = overDate * perDayFine;
		// console.log("fine", fine);

		req.order.fine = fine;
	} else {
		req.order.fine = 0;
	}

	next();
};

module.exports = calculateFine;
