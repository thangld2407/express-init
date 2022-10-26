const routerBinance = require('./module/binance');
const routerCoin = require('./module/coin');
const routerFuture = require('./module/future');

const routerApi = require('express').Router();

routerApi.get('/', (req, res) => {
	res.json({
		message: req.__('API_WORKING')
	});
});

routerApi.use(routerBinance);
routerApi.use(routerCoin);
routerApi.use(routerFuture);

module.exports = routerApi;
