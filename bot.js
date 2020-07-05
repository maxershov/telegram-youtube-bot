const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer-core");
require('dotenv').config();

let browser;
let page;

/* PATH to your chrome browser
  Comment it and change "puppeteer-core" to "puppeteer" if you want to download chromium browser 
*/
const CHROME_PATH = `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`;
/* YOUR_TELEGRAM_BOT_TOKEN  from @BotFather  */

const TOKEN = process.env.TELEGRAM_API_TOKEN;


run();

async function run() {
  const bot = new TelegramBot(TOKEN, { polling: true });

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    args: [`--window-size=1280,1024`]
  });
  page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 1024
  });

  await page.goto("https://music.youtube.com/");

  const keyBtns = { "keyboard": [["Next track"], ["Shuffle", "Turn off"], ["Volume -", "Volume +"]] };

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.text);

    switch (msg.text) {
      case "/start":
        bot.sendMessage(chatId, `Hello, <b>${msg.from.first_name}</b>`, { parse_mode: "HTML" });
        bot.sendMessage(chatId, `Send "1" to play next track, "2" to shuffle, "+" "-" to change volume and "0" to turn off`);
        break;

      case "Next track":
      case "1":
        page.keyboard.press("J");
        bot.sendMessage(chatId, "Next track", { "reply_markup": keyBtns });
        break;

      case "Volume -":
      case "-":
        page.keyboard.press("-");
        bot.sendMessage(chatId, "Volume -10", { "reply_markup": keyBtns });
        break;

      case "Volume +":
      case "+":
        page.keyboard.press("=");
        bot.sendMessage(chatId, "Volume +10", { "reply_markup": keyBtns });
        break;

      case "Turn off":
      case "0":
        process.exit(0);
        break;

      case "Shuffle":
      case "2":
        page.keyboard.press("S");
        bot.sendMessage(chatId, "Shuffle", { "reply_markup": keyBtns });
        break;

      default:
        bot.sendMessage(chatId, "Unknown command");
        bot.sendMessage(chatId, `Send "1" to play next track, "2" to shuffle, "+" "-" to change volume and "0" to turn off`, { "reply_markup": keyBtns });
    }
  });
}
