const mongoose = require('mongoose');

const SymbolModel = new mongoose.Schema(
	{
		symbol: {
			type: String,
			trim: true
		},
		ohlcv: {
			type: Array,
			default: []
		},
		last_updated: {
			type: Number
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Symbol', SymbolModel);
