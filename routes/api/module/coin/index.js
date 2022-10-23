const { getDataBinanceFromServer,getDataBinanceFromDb } = require('../../../../controller/SymbolController');

const routerCoin = require('express').Router();

routerCoin.post('/coin/binance', getDataBinanceFromServer);
routerCoin.post("/coin/binance/db", getDataBinanceFromDb)

module.exports = routerCoin;