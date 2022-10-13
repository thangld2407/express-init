const axiosInstance = require('../api/axiosInstance');
const DataModel = require('../model/DataModel');
const moment = require('moment');
const { default: axios } = require('axios');
const { db } = require('../model/DataModel');
const { default: mongoose } = require('mongoose');
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
			const body = req.body;
			let result = [];
			const { data } = await axios.get('https://www.bitmex.com/api/udf/history', {
				params: body
			});
			if (data.s === 'no_data') {
				return res.status(200).json({
					error_code: 100,
					error_message: 'No data',
					start_time: moment(body.from * 1000).format('YYYY-MM-DD HH:mm:ss'),
					end_time: moment(body.to * 1000).format('YYYY-MM-DD HH:mm:ss')
				});
			}

			data['t'].map((item, index) => {
				result.push({
					open_time: moment(item * 1000).format('YYYY-MM-DD HH:mm:ss'),
					open_price: data['o'][index],
					high_price: data['h'][index],
					low_price: data['l'][index],
					close_price: data['c'][index],
					volume: data['v'][index]
				});
			});

			res.json({
				message: `Data fetched successfully`,
				startDate: moment(body.from * 1000).format('YYYY-MM-DD HH:mm:ss'),
				endDate: moment(body.to * 1000).format('YYYY-MM-DD HH:mm:ss'),
				count: result.length,
				symbol: body.symbol,
				data: result
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				error_bitmex: error
			});
		}
	},

	async getDataFtx(req, res) {
		const { symbol, resolution, from, to } = req.body;

		try {
			const response = await axios.get(
				`https://ftx.com/api/markets/${symbol}/candles?resolution=${resolution}&start_time=${from}&end_time=${to}`
			);
			let result = [];
			if (response.data.success) {
				const data = response.data.result;
				let end_time = from;
				if (data && data.length > 0) {
					data.map((item, index) => {
						if (index === 0) {
							end_time = end_time;
						} else {
							end_time = end_time += resolution;
						}
						result.push({
							open_time: moment(end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
							close_time: moment((end_time + resolution) * 1000).format(
								'YYYY-MM-DD HH:mm:ss'
							),
							time_stampe_open: end_time * 1000,
							time_stampe_close: end_time * 1000 + resolution * 1000,
							resolution: resolution,
							open_price: item.open,
							high_price: item.high,
							low_price: item.low,
							close_price: item.close,
							volume: item.volume
						});
					});
				}
				db.createCollection(`${symbol}-${Math.random(1, 10000)}`);
				mongoose.connection.db.listCollections().toArray(function (err, names) {
					console.log(names);
				});
				res.status(200).json({
					total: result.length,
					data: result
				});
			}
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: error.code
			});
		}
	},

	async getDataKucoin(req, res) {
		const { symbol, resolution, from, to } = req.body;
		const url = `https://www.kucoin.com/_api/order-book/candles?begin=${from}&end=${to}&lang=en_US&symbol=${symbol}&type=${resolution}`;
		try {
			const response = await axios.get(url);

			let result = [];
			response.data.data.map(item => {
				result.push({
					resolution: resolution,
					open_price: item[2],
					high_price: item[3],
					low_price: item[4],
					close_price: item[5],
					volume: item[6]
				});
			});
			res.status(200).json({
				total: result.length,
				data: response.data.data
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: error.code
			});
		}
	}
};
