const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
	open_time: {
		type: String,
		trim: true
	},
	close_time: {
		type: String,
		trim: true
	},
	symbol: {
		type: String,
		trim: true
	},
	high_price: {
		type: String,
		trim: true
	},
	low_price: {
		type: String,
		trim: true
	},
	open_price: {
		type: String,
		trim: true
	},
	close_price: {
		type: String,
		trim: true
	},
	close_tmp_price: {
		type: String,
		trim: true
	},
	volume: {
		type: String,
		trim: true
	}
});

module.exports = mongoose.model('Market', DataSchema);
