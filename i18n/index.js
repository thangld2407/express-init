const i18n = require('i18n');

i18n.configure({
	locales: ['vi', 'en'],
	directory: __dirname + '/locales'
});

module.exports = function (req, res, next) {
	let lang = undefined;

	i18n.init(req, res);
	lang = lang ? lang : 'vi';
	i18n.setLocale(req, lang);
	return next();
};
