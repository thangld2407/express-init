const {
	getDataBinanceFromServer,
	getDataBinanceFromDb,
	getDataBinanceFromDbByTime
} = require('../../../../controller/SymbolController');

const routerCoin = require('express').Router();

routerCoin.post('/coin/binance', getDataBinanceFromServer);
routerCoin.post('/coin/binance/db', getDataBinanceFromDb);
routerCoin.get('/coin/binance/:symbol', getDataBinanceFromDbByTime);

module.exports = routerCoin;
