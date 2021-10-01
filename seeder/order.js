const faker = require("faker");
const User = require("../server/models/User");
const Book = require("../server/models/Books");
const Order = require("../server/models/Orders");

async function seedOrder() {
	const getBook = await Book.find();
	const getUser = await User.find();

	for (let i = 0; i < 1000; i++) {
		let newOrder = new Order();
		newOrder.shippingAddress = {
			city: faker.address.city(),
			phone: faker.phone.phoneNumber(),
			address: faker.address.streetAddress(),
		};
		newOrder.issuedDate = faker.date.past();
		newOrder.expiryDate = faker.date.future();
		newOrder.bookID = getBook[i]._id;
		newOrder.userID = getUser[i]._id;

		await newOrder.save();
	}
	console.log("Orders Seeded");
}

module.exports = seedOrder;
