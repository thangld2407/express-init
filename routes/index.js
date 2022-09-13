const requireLogin = require('../middleware/requireLogin');
const routerApi = require('./api');
const routerClient = require('./client');

const router = require('express').Router();

router.use('/api', requireLogin, routerApi);

router.use(routerClient);

module.exports = router;
