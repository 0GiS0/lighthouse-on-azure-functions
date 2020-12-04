const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

module.exports = async function(context, req) {
	const url = req.query.url || (req.body && req.body.url);
	context.log(`Analyzing URL ${url}`);

	// Use Puppeteer
	const browser = await puppeteer.launch({ headless: true });

	// Lighthouse will analyze the URL using puppeter
	const { lhr } = await lighthouse(url, {
		disableDeviceEmulation: true,
		port: new URL(browser.wsEndpoint()).port,
		output: 'json',
		logLevel: 'info'
	});

	context.log(`Lighthouse scores: ${Object.values(lhr.categories).map((c) => c.score).join(', ')}`);

	browser.disconnect();
	browser.close();

	context.res = {
		// status: 200, /* Defaults to 200 */
		body: lhr
	};
};
