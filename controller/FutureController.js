const { default: axios } = require('axios');
const axiosInstance = require('../api/axiosInstance');
const { switchRequestTime } = require('../helper/switchRequest');
const SymbolModel = require('../model/SymbolModel');
const moment = require('moment');

module.exports = {
	async getDataFuture(req, res) {
		const { symbol, startTime } = req.body;

		let timing = switchRequestTime(startTime);
		let params = {
			symbol: symbol.toUpperCase(),
			interval: '1m',
			startTime: timing.start_time_timestamp,
			endTime: timing.end_time_17h,
			limit: 1000
		};

		let result = [];
		try {
			let dataGlobal = [];
			const response_first = await axios.get('https://dapi.binance.com/dapi/v1/klines', {
				params
			});
			dataGlobal = [...dataGlobal, ...response_first.data];
			const response_second = await axios.get('https://dapi.binance.com/dapi/v1/klines', {
				params: {
					startTime: timing.end_time_17h,
					endTime: timing.end_time_11h59,
					...params
				}
			});

			dataGlobal = [...dataGlobal, ...response_second.data];

			if (dataGlobal && dataGlobal.length > 0) {
				dataGlobal.map(item => {
					result.push([
						item[0], //Open Time
						item[1] * 1, //open price
						item[2] * 1, // high price
						item[3] * 1, //low price
						item[4] * 1, //close price
						item[5] * 1 //volume
					]);
				});
			}
			const dataSave = new SymbolModel({
				symbol: symbol.toUpperCase(),
				ohlcv: result,
				last_updated: moment(timing.end_time_11h59)
					.add(1, 'minute')
					.format('YYYY-MM-DD HH:mm:ss')
			});
			await dataSave.save();

			res.json({
				message: 'Data fetched successfully',
				count_data: result.length
			});
		} catch (error) {
			res.json({ error });
		}
	}
};