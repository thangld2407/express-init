const axios = require('axios');

const axiosInstance = axios.create({
	baseURL: 'https://api.binance.com',
	timeout: 1000
});

module.exports = axiosInstance;
