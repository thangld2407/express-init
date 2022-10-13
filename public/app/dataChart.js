async function getData() {
	const data = {
		symbol: 'BTC-PERP',
		resolution: 60,
		from: 1564603200,
		to: 1564606800
	};
	const response = await axios.post('/api/ftx/history', data);
	return response.data;
}

window.addEventListener('DOMContentLoaded', async event => {
	let dataCandle = [];
	let dataLine = [];
	const response = await getData();
	response.data.map((item, index) => {
		if (index === 20 || index === 30 || index === 40 || index === 50) {
			dataLine.push({
				x: new Date(response['data'][index].time_stampe_open),
				y: response['data'][index].volume
			});
		}
		dataCandle.push({
			x: new Date(item.time_stampe_open),
			y: [item.open_price, item.high_price, item.low_price, item.close_price]
		});
	});

	var options = {
		series: [
			{
				name: 'candle',
				type: 'candlestick',
				data: dataCandle
			}
		],
		chart: {
			height: 500,
			type: 'candlestick',
			toolbar: {}
		},
		title: {
			text: 'CandleStick Chart',
			align: 'left'
		},
		stroke: {
			width: [3, 1]
		},
		tooltip: {
			shared: true
		},
		xaxis: {
			type: 'datetime',
			tooltip: {
				enabled: false
			},
			labels: {
				formatter: function (value, timestamp) {
					return new Date(timestamp).toLocaleString();
				}
			}
		},
		yaxis: {
			tooltip: {
				enabled: true
			}
		}
	};

	let chart = new ApexCharts(document.querySelector('#chart'), options);
	chart.render();
});
