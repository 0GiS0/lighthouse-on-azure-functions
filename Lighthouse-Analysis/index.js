const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

module.exports = async function(context, req) {
	const url = req.query.url || (req.body && req.body.url);
	context.log(`Analyzing URL ${url}`);

	// Use Puppeteer
	const browser = await puppeteer.launch();

	// Lighthouse will analyze the URL using puppeter
	const { lhr } = await lighthouse(url, {
		port: new URL(browser.wsEndpoint()).port,
		output: 'json',
		logLevel: 'info'
	});

	context.log(`Lighthouse scores: ${Object.values(lhr.categories).map((c) => c.score).join(', ')}`);

	context.res = {
		// status: 200, /* Defaults to 200 */
		body: lhr
	};
};
