const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// app.use(logger("dev"));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

require("./server/config/mongodb");

app.use(require("./server/routes/index"));

app.get("/", function (req, res, next) {
	res.send("Home Page");
});

app.listen(port, () => {
	console.log(`App is listening on port: ${port}`);
});

// module.exports = app;
