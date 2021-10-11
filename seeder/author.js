const faker = require("faker");
const Author = require("../server/models/Authors");

async function seedAuthor() {
	for (let i = 0; i < 100; i++) {
		let newAuthor = new Author();
		newAuthor.first_name = faker.name.firstName();
		newAuthor.last_name = faker.name.lastName();
		newAuthor.areaOfInterest = faker.datatype.number({
			min: 1,
			max: 2,
		});
		await newAuthor.save();
	}
	console.log("Authors Seeded");
}

module.exports = seedAuthor;
