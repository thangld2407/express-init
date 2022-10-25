const { default: axios } = require('axios');
const cron = require('node-cron');
const moment = require('moment');

let START_DATE = '2017-08-20';

async function callCron() {
	try {
		const response = await axios.post('http://localhost:3000/api/coin/binance/db', {
			symbol: 'BTCUSDT'
		});

		const current_time = moment().format('x');
		let count = 0;
		if (response.data.data && Object.keys(response.data.data).length > 0) {
			const last_updated = moment(response.data.data.last_updated).format('x');
			const diff = Math.ceil((current_time - last_updated) / (24 * 60 * 60 * 1000));
			for (let i = 0; i <= diff; i++) {
				let startTimeRequestApi = moment(response.data.data.last_updated)
					.add(i, 'days')
					.format('YYYY-MM-DD');
				const res = await axios.post('http://localhost:3000/api/coin/binance', {
					symbol: 'BTCUSDT',
					startTime: startTimeRequestApi
				});
				console.log('Đang lấy data ngày ', startTimeRequestApi);
				console.log(`====== ${res.data.message} =====`);
			}
		} else {
			const res = await axios.post('http://localhost:3000/api/coin/binance', {
				symbol: 'BTCUSDT',
				startTime: START_DATE
			});
			console.log('Đang lấy data ngày ', START_DATE);
			console.log(`====== ${res.data.message} =====`);
		}
	} catch (error) {
		console.log(error);
	}
}

callCron();
