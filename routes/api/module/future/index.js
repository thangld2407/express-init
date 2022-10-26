const { getDataFuture } = require('../../../../controller/FutureController');

const routerFuture = require('express').Router();

routerFuture.post('/future/coin/init', getDataFuture);

module.exports = routerFuture;
