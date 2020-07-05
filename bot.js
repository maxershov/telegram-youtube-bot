const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer-core");
require('dotenv').config();

let browser, page;

/* PATH to your chrome browser
  Comment it and change "puppeteer-core" to "puppeteer" if you want to download chromium browser 
*/
const CHROME_PATH = `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`;

/* YOUR_TELEGRAM_BOT_TOKEN  from @BotFather  */
const TOKEN = process.env.TELEGRAM_API_TOKEN;


run();

async function run() {
  const bot = new TelegramBot(TOKEN, { polling: true });
  const keyBtns = { "keyboard": [["Следующий трек", "Плейлисты"], ["Перемешать", "Выключить"], ["Громкость -", "Громкость +"]] };


  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    args: ['--lang=en-GB,en']
  });

  page = await browser.newPage();

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' })

  await page.goto("https://music.youtube.com/", { waitUntil: 'networkidle0' });

  /* get links to playlist from page */
  const hrefs = await page.$$eval('a', as => as.map(a => {
    if (a.href && a.title) return ([a.href, `/${a.title.replace(/[^A-Za-z0-9ЁёА-я]/g, '_')}`])
  }));
  const links = hrefs.filter(x => x);



  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.from.first_name, msg.text);

    /* check if command starts with Capital letter and find link from hrefs */
    if (msg.text[1].match(new RegExp(/[A-ZЁ-Я]/))) {
      for (let playlist of links) {
        if (playlist[1] === msg.text) {
          bot.sendMessage(chatId, `Включаю ${msg.text}`);
          await page.goto(playlist[0], { waitUntil: 'networkidle0' });
          await page.keyboard.press("Tab");
          await page.keyboard.press("Enter");
        }
      }
    } else {

      switch (msg.text) {
        case "/start":
          bot.sendMessage(chatId, `Привет, <b>${msg.from.first_name}</b>`, { parse_mode: "HTML" });
          bot.sendMessage(chatId, `/1 для включения следующего трека \n /2 чтобы перемешать \n /3 для переключения плейлиста \n /0 для выключения музыки`, { "reply_markup": keyBtns })
          break;

        case "Следующий трек":
        case "/1":
          await page.keyboard.press("J");
          bot.sendMessage(chatId, "Включаю следующий трек", { "reply_markup": keyBtns });
          break;

        case "Громкость -":
        case "/-":
          await page.keyboard.press("-");
          bot.sendMessage(chatId, "Громкость -10", { "reply_markup": keyBtns });
          break;

        case "Громкость +":
        case "/+":
          await page.keyboard.press("=");
          bot.sendMessage(chatId, "Громкость +10", { "reply_markup": keyBtns });
          break;

        case "Выключить":
        case "/0":
          process.exit(0);
          break;

        case "Перемешать":
        case "/2":
          await page.keyboard.press("S");
          await page.keyboard.press("J");
          bot.sendMessage(chatId, "Shuffle..", { "reply_markup": keyBtns });
          break;

        case "Плейлисты":
        case "/3":

          bot.sendMessage(chatId,
            ` ${links.map(link => link[1]).join(`\n \n`)}`
            , { "reply_markup": keyBtns });
          break;

        default:
          bot.sendMessage(chatId, "Неизвестная команда");
          bot.sendMessage(chatId, `/1 для включения следующего трека \n /2 чтобы перемешать \n /3 для переключения плейлиста \n /0 для выключения музыки`, { "reply_markup": keyBtns })
      }
    }
  });
}