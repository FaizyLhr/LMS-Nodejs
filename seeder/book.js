const faker = require("faker");
const Book = require("../server/models/Books");
const Author = require("../server/models/Authors");

async function seedBook() {
	const getAuthor = await Author.find();

	for (let i = 0; i < 100; i++) {
		let newBook = new Book();
		newBook.genre = faker.music.genre();
		newBook.title = faker.name.title();
		newBook.ISBN = faker.datatype.number();
		newBook.author = getAuthor[i]._id;
		await newBook.save();
	}
	console.log("Books Seeded");
}

module.exports = seedBook;
