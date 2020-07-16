const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();
const openBrowser = require("./openBrowser");

/* PATH to your chrome browser
  Comment it and change "puppeteer-core" to "puppeteer" if you want to download chromium browser 
*/
const CHROME_PATH = `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`;

/* YOUR_TELEGRAM_BOT_TOKEN from @BotFather  */
const TOKEN = process.env.TELEGRAM_API_TOKEN;


run();

async function run() {
  const bot = new TelegramBot(TOKEN, { polling: true });
  const MSG_BUTTONS = { "keyboard": [["Следующий трек", "Плейлисты"], ["Перемешать", "Выключить"], ["Громкость -", "Пауза", "Громкость +"]] };

  const page = await openBrowser(CHROME_PATH);
  await page.goto("https://music.youtube.com/", { waitUntil: 'networkidle0' });
  const links = await getPlaylists(page);


  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg.from.first_name, msg.text);

    /* check if command starts with Capital letter and find link from hrefs */
    if (msg.text[1].match(new RegExp(/[A-ZЁ-Я]/))) {
      for (let playlist of links) {
        if (playlist[1] === msg.text) {
          await page.goto(playlist[0], { waitUntil: 'networkidle0' });
          await page.keyboard.press("Tab");
          await page.keyboard.press("Enter");
          console.log("call this why? ", playlist[1]);
          bot.sendMessage(chatId, `Включаю ${msg.text}`);
          break;
        }
      }

    } else {
      switch (msg.text) {
        case "/start":
          bot.sendMessage(chatId, `Привет, <b>${msg.from.first_name}</b>`, { parse_mode: "HTML" });
          bot.sendMessage(chatId, `/1 для включения следующего трека \n /2 чтобы перемешать \n /3 для переключения плейлиста \n /0 для выключения музыки`, { "reply_markup": MSG_BUTTONS })
          break;

        case "Следующий трек":
        case "/1":
          await page.keyboard.press("J");
          await page.waitForSelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string", { timeout: 4000 });

          const song = await page.$eval("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string", el => el.title);
          const artist = await page.$eval("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string:nth-child(1)", el => el.title);

          bot.sendMessage(chatId, `Включаю ${artist} - ${song} `, { "reply_markup": MSG_BUTTONS });
          break;

        case "Громкость -":
        case "/-":
          await page.keyboard.press("-");
          const volumeSub = await page.$eval("#expand-volume-slider", el => el.value);
          bot.sendMessage(chatId, `Громкость ${volumeSub}`, { "reply_markup": MSG_BUTTONS });
          break;

        case "Громкость +":
        case "/+":
          await page.keyboard.press("=");
          const volumeAdd = await page.$eval("#expand-volume-slider", el => el.value);
          bot.sendMessage(chatId, `Громкость ${volumeAdd}`, { "reply_markup": MSG_BUTTONS });
          break;

        case "Пауза":
          await page.keyboard.press("Space");
          bot.sendMessage(chatId, "Пауза", { "reply_markup": MSG_BUTTONS });
          break;

        case "Выключить":
        case "/0":
          process.exit(0);
          break;

        case "Перемешать":
        case "/2":
          await page.keyboard.press("S");
          await page.keyboard.press("J");
          bot.sendMessage(chatId, "Shuffle..", { "reply_markup": MSG_BUTTONS });
          break;

        case "Плейлисты":
        case "/3":

          bot.sendMessage(chatId,
            ` ${links.map(link => link[1]).join(`\n \n`)}`
            , { "reply_markup": MSG_BUTTONS });
          break;

        default:
          bot.sendMessage(chatId, "Неизвестная команда");
          bot.sendMessage(chatId, `/1 для включения следующего трека \n /2 чтобы перемешать \n /3 для переключения плейлиста \n /0 для выключения музыки`, { "reply_markup": MSG_BUTTONS })
      }
    }
  });
}



/** Get all anchors from page, check if it has title and href, add "/" and chg spaces to "_" to send as command in telegram 
 *  "New Songs List" => "/New_Songs_List"
*/
async function getPlaylists(page) {
  // Let's the magic begins
  return page.$$eval('a', a => a.reduce((accumulator, link) => {
    if (link.href && link.title) accumulator.push([link.href, `/${link.title.replace(/[^A-Za-z0-9ЁёА-я]/g, '_')}`])
    return accumulator;
  }, []));
}