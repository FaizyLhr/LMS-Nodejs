const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

require("./server/config/mongodb");

app.use(require("./server/routes/index"));

app.get("/", function (req, res, next) {
	res.send("Home Page");
});

app.listen(port, () => {
	console.log(`App is listening on port: ${port}`);
});
