const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost/LMS", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	})
	.then(() => {
		console.log("connected to db in development environment");
		init();
	});

const user = require("./seeder/user");
const author = require("./seeder/author");
const book = require("./seeder/book");
const order = require("./seeder/order");

async function init() {
	console.log("dropping DB");
	await mongoose.connection.db.dropDatabase();

	await user();
	await author();
	await book();
	await order();

	exit();
}

function exit() {
	console.log("exiting");
	process.exit(1);
}
