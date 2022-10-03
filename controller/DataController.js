const axiosInstance = require('../api/axiosInstance');
const DataModel = require('../model/DataModel');
const moment = require('moment');
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
		const { symbol, windowSize } = req.body;
		const params = {
			symbol: symbol.toUpperCase(),
			windowSize
		};
		try {
			const response = await axiosInstance.get('/api/v3/ticker', {
				params
			});
			res.json({
				message: 'Data fetched successfully',
				data: response.data
			});
		} catch (error) {
			res.json({ error: error.message });
		}
	}
};
