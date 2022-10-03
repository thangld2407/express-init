var websocket = require('websocket-stream');

async function process() {
	var ws = websocket('wss://stream.binance.com:9443//BTCUSDT@kline_1000');
	ws.on('data', function (data) {
		console.log(data);
	});
	ws.on('error', error => {
		console.log('erroâadadr', error);
	});
}

process();
