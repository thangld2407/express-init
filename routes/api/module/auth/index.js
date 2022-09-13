const routerAuht = require('express').Router();

routerAuht.get('/auth', (req, res) => {
	res.json({
		message: req.__('AUTH_WORKING')
	});
});

module.exports = routerAuht;
