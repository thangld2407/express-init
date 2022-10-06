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
	}
};
