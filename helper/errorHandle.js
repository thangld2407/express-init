module.exports = async function (ctx, next) {
	try {
		await next();
	} catch (error) {
		ctx.status = 500;
		ctx.err = error;
		ctx.body = {
			message: error.message,
			error_code: 500
		};
	}
};
