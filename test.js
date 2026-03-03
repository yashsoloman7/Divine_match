const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting puppeteer...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log("Navigating to http://localhost:5173/");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.error(e));

    const rootHTML = await page.evaluate(() => document.getElementById('root') ? document.getElementById('root').innerHTML : 'NO_ROOT');
    console.log("ROOT HTML LENGTH:", rootHTML.length);
    if (rootHTML.length < 500) {
        console.log("ROOT HTML CONTENT:", rootHTML);
    }

    await browser.close();
})();
