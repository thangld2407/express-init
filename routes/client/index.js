const routerClient = require('express').Router();

routerClient.get('/', (req, res) => {
	res.render('./components/layout.ejs', {
		message: req.__('CLIENT_WORKING'),
		page: '../pages/home.ejs'
	});
});

routerClient.get('/about', (req, res) => {
	res.render('./components/layout.ejs', {
		message: req.__('ABOUT_WORKING'),
		page: '../pages/about.ejs'
	});
});

routerClient.get('*', (req, res) => {
	res.render('./pages/404.ejs');
});

module.exports = routerClient;
