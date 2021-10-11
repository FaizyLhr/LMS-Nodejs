// const request = require("supertest");
// const app = require("./app");

// describe("Users API", () => {
// 	it("POST /api/signUp  --> SignUp a user", () => {
// 		return request(app)
// 			.post("/user")
// 			.send({
// 				username: expect.any(String),
// 				email: expect.any(String),
// 				userType: expect.any(Number),
// 				password: expect.any(String),
// 			})
// 			.expect("Content-Type", /json/)
// 			.expect(201)
// 			.then((response) => {
// 				expect(response.body).toEqual(
// 					expect.objectContaining({
// 						message: expect.any(String),
// 					})
// 				);
// 			});
// 	});
// });
