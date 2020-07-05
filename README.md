# telegram-youtube-bot

Run chrome browser with Youtube Music and change tracks with telegram bot. Run ```npm i``` and set ```TOKEN``` and ```CHROME_PATH``` in ```bot.js```. Run ```npm start``` to start bot and open browser.

<p align="center">
<img src="https://github.com/maxershov/telegram-youtube-bot/blob/master/screenshots/s0.jpg" width="60%">
</p>

**Цель:**

Контроль над проигрываемой музыкой в публичном помещении. Позволяет включать следующий трек из плейлиста и контролировать громкость. Через Telegram бот с программой могут взаимодействовать сразу **несколько человек**. Сам проигрыватель открывается через Puppeteer. Использован сервис Youtube Music (в аудиосистеме умер bluetooth - пришлось быстро собрать альтернативу из костылей и палок).

Из-за недавней разблокировки Telegram на территории РФ, больше не нужно встраивать прокси для работы локального сервера!

Для начала работы:

Введите ```npm i``` и добавьте ```TOKEN``` и ```CHROME_PATH``` в ```bot.js```. Запустите ```npm start``` для запуска бота и открытия браузера

