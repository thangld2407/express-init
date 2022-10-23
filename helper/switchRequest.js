const moment = require('moment');
module.exports = {
	switchRequestTime(start_time) {
		// calculate from 0h to 5h PM;
		let start_time_timestamp = moment(start_time).startOf('day').format('X');
		let end_time_17h = moment(start_time).startOf('day').add(17, 'hours').format('X');
		let end_time_11h59 = moment(start_time)
			.startOf('day')
			.add(23, 'hours')
			.add(59, 'minutes')
			.format('X');
		return {
			start_time_timestamp: start_time_timestamp * 1000,
			end_time_17h: end_time_17h * 1000,
			end_time_11h59: end_time_11h59 * 1000
		};
	}
};
