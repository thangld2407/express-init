const routerBinance = require('./module/binance');

const routerApi = require('express').Router();

routerApi.get('/', (req, res) => {
	res.json({
		message: req.__('API_WORKING')
	});
});

routerApi.use(routerBinance);

module.exports = routerApi;
