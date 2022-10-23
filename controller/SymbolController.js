const axiosInstance = require('../api/axiosInstance');
const { switchRequestTime } = require('../helper/switchRequest');
const SymbolModel = require('../model/SymbolModel');
const moment = require('moment');
const { response } = require('express');
module.exports = {
	async getDataBinanceFromServer(req, res) {
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
			const hasSymbolDb = await SymbolModel.findOne({ symbol: symbol.toUpperCase() });

			let dataGlobal = [];
			const response_first = await axiosInstance.get('/api/v3/klines', {
				params
			});
			dataGlobal = [...dataGlobal, ...response_first.data];
			const response_second = await axiosInstance.get('/api/v3/klines', {
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


			if (hasSymbolDb && Object.keys(hasSymbolDb).length > 0) {
				await SymbolModel.findOneAndUpdate(
					{
						symbol: symbol.toUpperCase()
					},
					{
						ohlcv: [...hasSymbolDb.ohlcv, result],
						last_updated: moment(timing.end_time_11h59)
							.add(1, 'minute')
							.format('YYYY-MM-DD HH:mm:ss')
					}
				);
			} else {
				const dataSave = new SymbolModel({
					symbol: symbol.toUpperCase(),
					ohlcv: result,
					last_updated: moment(timing.end_time_11h59)
						.add(1, 'minute')
						.format('YYYY-MM-DD HH:mm:ss')
				});
				await dataSave.save();
			}

			res.json({
				message: 'Data fetched successfully'
			});
		} catch (error) {
			res.json({ error });
		}
	},
	async getDataBinanceFromDb(req, res) {
		try {
			const { symbol } = req.body;
			const data = await SymbolModel.findOne({ symbol: symbol.toUpperCase() });
			res.status(200).json({
				data
			});
		} catch (error) {
			res.status(500).send({ error: 'Something went wrong!', error: error.message });
		}
	}
};