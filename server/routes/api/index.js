let router = require("express").Router();

router.use("/", require("./users"));
router.use("/", require("./author"));
router.use("/", require("./book"));
router.use("/", require("./order"));

// router.use("/", (req, res) => {
// 	res.send("API Home");
// });

module.exports = router;
