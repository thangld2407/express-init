const {
	postData,
	getData,
	getDataStatistic,
	getDataBitmex
} = require('../../../../controller/DataController');

const routerBinance = require('express').Router();

routerBinance.post('/binance/statistic', postData);
routerBinance.post('/binance', getData);
routerBinance.post('/binance/ticker', getDataStatistic);
routerBinance.post('/bitmex/list', getDataBitmex);

module.exports = routerBinance;
