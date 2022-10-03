const { postData, getData, getDataStatistic } = require('../../../../controller/DataController');

const routerBinance = require('express').Router();

routerBinance.post('/binance/statistic', postData);
routerBinance.post('/binance', getData);
routerBinance.post('/binance/ticker', getDataStatistic);

module.exports = routerBinance;
