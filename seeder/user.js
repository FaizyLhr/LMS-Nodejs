const faker = require("faker");
const User = require("../server/models/User");

async function seedUser() {
	for (let i = 0; i < 1000; i++) {
		let newUser = new User();
		newUser.username = faker.internet.userName();
		newUser.email = faker.internet.email();
		newUser.userType = faker.datatype.number({
			min: 1,
			max: 2,
		});
		newUser.password = faker.internet.password();
		// console.log(newUser);
		await newUser.save();
	}
	console.log("Users Seeded");
}

module.exports = seedUser;
