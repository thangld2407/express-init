module.exports = function (req, res, next) {
	// if (!req.headers.authorization) {
	// 	return res.status(401).send({ error: 'You must log in!' });
	// }

	return next();
};
