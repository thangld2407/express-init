const axiosInstance = require('../api/axiosInstance');
const DataModel = require('../model/DataModel');
const moment = require('moment');
const { default: axios } = require('axios');
module.exports = {
	async postData(req, res) {
		const { symbol, windowSize } = req.body;
		const params = {
			symbol,
			windowSize
		};
		try {
			const response = await axiosInstance.get('/api/v3/ticker', {
				params
			});
			const data = response.data;
			const dataModel = new DataModel({
				symbol: symbol.toUpperCase(),
				high_price: data.highPrice,
				low_price: data.lowPrice,
				open_price: data.openPrice,
				close_price: data.lastPrice,
				volume: data.volume,
				open_time: moment(data.openTime).format('YYYY-MM-DD HH:mm:ss'),
				close_time: moment(data.closeTime).format('YYYY-MM-DD HH:mm:ss'),
				close_tmp_price: data.lastPrice
			});
			await dataModel.save();
			const responeDb = await DataModel.find({ symbol: symbol.toUpperCase() });
			res.json({
				message: 'Data saved successfully',
				data: responeDb,
				dataModel: dataModel
			});
		} catch (error) {
			res.status(500).send({ error: 'Something went wrong!', error: error.message });
		}
	},
	async getData(req, res) {
		try {
			const { symbol } = req.body;
			console.log(symbol);
			const response = await DataModel.find({ symbol: symbol });
			res.json({
				message: 'Data fetched successfully',
				data: response,
				count: response.length,
				symbol: symbol
			});
		} catch (error) {
			res.status(500).send({ error: 'Something went wrong!', error: error.message });
		}
	},
	async getDataStatistic(req, res) {
		const { symbol, interval, startTime, endTime, limit } = req.body;
		const params = {
			symbol: symbol.toUpperCase(),
			interval,
			startTime,
			endTime,
			limit
		};
		const result = [];
		try {
			const { data } = await axiosInstance.get('/api/v3/klines', {
				params
			});
			if (data && data.length > 0) {
				data.map(item => {
					result.push({
						open_time: moment(item[0]).format('YYYY-MM-DD HH:mm:ss'),
						open_price: item[1],
						high_price: item[2],
						low_price: item[3],
						close_price: item[4],
						volume: item[5],
						close_time: moment(item[6]).format('YYYY-MM-DD HH:mm:ss')
					});
				});
			}
			res.json({
				message: 'Data fetched successfully',
				data: result
			});
		} catch (error) {
			res.json({ error: error.message });
		}
	},

	async getDataBitmex(req, res) {
		try {
			const query = req.query;
			let result = [];
			const { data } = await axios.get('https://www.bitmex.com/api/udf/history', {
				params: query
			});
			if (data.s === 'no_data') {
				return res.status(200).json({
					error_code: 100,
					error_message: 'No data'
				});
			}

			result.push({
				time: {
					prev: moment(data.t[0] * 1000)
						.utc(false)
						.format('YYYY-MM-DD HH:mm:ss'),
					curent: moment(data.t[1] * 1000)
						.utc(false)
						.format('YYYY-MM-DD HH:mm:ss')
				},
				close_price: {
					prev: data.c[0],
					curent: data.c[1]
				},
				open_price: {
					prev: data.o[0],
					curent: data.o[1]
				},
				high_price: {
					prev: data.h[0],
					curent: data.h[1]
				},
				low_price: {
					prev: data.l[0],
					curent: data.l[1]
				},
				volume: {
					prev: data.v[0],
					curent: data.v[1]
				}
			});

			res.json({
				message: 'Data fetched successfully',
				symbol: query.symbol,
				data: result
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				error_bitmex: error
			});
		}
	}
};
