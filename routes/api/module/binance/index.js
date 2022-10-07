const {
	postData,
	getData,
	getDataStatistic,
	getDataBitmex,
	getDataFtx,
	getDataKucoin
} = require('../../../../controller/DataController');

const routerBinance = require('express').Router();

routerBinance.post('/binance/statistic', postData);
routerBinance.post('/binance', getData);
routerBinance.post('/binance/ticker', getDataStatistic);
routerBinance.post('/bitmex/history', getDataBitmex);
routerBinance.post('/ftx/history', getDataFtx);
routerBinance.post('/kucoin/history', getDataKucoin);

module.exports = routerBinance;
