const mongoose = require('mongoose');

const DataCategorySchema = new mongoose.Schema({
	date_get_data: {
		type: String,
		trim: true
	},
	data: {
		type: Array,
		default: []
	},
	symbol: {
		type: String,
		trim: true
	}
});

module.exports = mongoose.model('CategoryDate', DataCategorySchema);
