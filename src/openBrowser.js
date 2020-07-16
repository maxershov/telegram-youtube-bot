const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer-core");


/** Open local Chrome browser from CHROME_PATH */
async function openBrowser(CHROME_PATH) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    args: ['--lang=en-GB,en']
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' })
  return page;
}

module.exports = openBrowser;