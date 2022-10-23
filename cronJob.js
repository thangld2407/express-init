const { default: axios } = require('axios');
const cron = require('node-cron');
const moment = require('moment');

async function callCron() {
	try {
		const response = await axios.post('http://localhost:5000/api/coin/binance/db', {
			symbol: 'BTCUSDT'
		});

		let startTimeRequestApi;
		const current_time = moment().format('x');
		let count = 0;
		if (response.data.data && Object.keys(response.data.data).length > 0) {
			const last_updated = moment(response.data.data.last_updated).format('x');
			const diff = Math.ceil((current_time - last_updated) / (24 * 60 * 60 * 1000));
			for (let i = 0; i <= diff; i++) {
				startTimeRequestApi = moment(response.data.data.last_updated)
					.add(i, 'days')
					.format('YYYY-MM-DD');
				const res = await axios.post('http://localhost:5000/api/coin/binance', {
					symbol: 'BTCUSDT',
					startTime: startTimeRequestApi
				});
				console.log(res.data);
				console.log('====== BTCUSDT =====');
				console.log('Đang lấy data ngày ', startTimeRequestApi);
				console.log(`====== ${res.data.message} =====`);
			}
		}
	} catch (error) {
		console.log(error);
	}
}

callCron();
