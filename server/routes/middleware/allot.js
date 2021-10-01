const UserModel = require("../../models/User");
const BlogModel = require("../../models/Blog");
const CommentModel = require("../../models/Comment");

const getUser = async (req, res, next) => {
	// console.log(req.params._id);
	const _id = req.params._id;
	if (_id) {
		req.user = await UserModel.findOne({ _id });
		if (!req.user) {
			return res.status(403).send("No User Found");
		}
	}
	// console.log(req.user);
	next();
};

const getSpecUser = async (req, res, next) => {
	// console.log(req.params.id);
	const _id = req.params.id;
	if (_id) {
		req.user = await UserModel.findOne({ _id });
		if (!req.user) {
			// console.log(req.user);
			return res.status(403).send("No Spec Found");
		}
	}
	// console.log(req.user);
	next();
};

const getSpecBlog = async (req, res, next) => {
	// console.log(req.params.id);
	const _id = req.params.id;
	if (_id) {
		req.blog = await BlogModel.findOne({ _id });
		if (!req.blog) {
			// console.log(req.blog);
			return res.status(403).send("No Spec Blog Found");
		}
	}
	// console.log(req.blog);
	next();
};

const getComment = async (req, res, next) => {
	// console.log(req.params.id);
	const _id = req.params.commentID;
	if (_id) {
		req.comment = await CommentModel.findOne({ _id });
		if (!req.comment) {
			// console.log(req.comment);
			return res.status(403).send("No Spec comment Found");
		}
	}
	// console.log(req.comment);
	next();
};

module.exports = { getUser, getSpecUser, getSpecBlog, getComment };
