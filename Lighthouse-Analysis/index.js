const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

module.exports = async function(context, req) {
	const url = req.query.url || (req.body && req.body.url);
	context.log(`Analyzing URL ${url}`);

	// Use Puppeteer
	//https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerlaunchoptions
	const browser = await puppeteer.launch({
		headless: true,
		timeout: 0,
		args: [ '--no-sandbox' ],
		executablePath: process.env.CHROMIUM_PATH
	});

	// Lighthouse will analyze the URL using puppeter
	const { lhr } = await lighthouse(url, {
		maxWaitForFcp: 30 * 1000,
		disableDeviceEmulation: true,
		port: new URL(browser.wsEndpoint()).port,
		output: 'json',
		logLevel: 'info',
		onlyCategories: [ 'seo', 'performance', 'accessibility', 'best-practices' ] //just analyze what you need
	});

	let result = {
		performance: lhr.categories.performance.score,
		accessibility: lhr.categories.accessibility.score,
		seo: lhr.categories.seo.score,
		// pwa: lhr.categories.pwa.score,
		bestpractices: lhr.categories['best-practices'].score
	};

	context.log(`result for ${url} is ${JSON.stringify(result)}`);

	browser.disconnect();
	await browser.close();

	context.res = {
		status: result.performance != null ? 200 : 500,
		body: result
	};
};
