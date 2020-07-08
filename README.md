# telegram-youtube-bot

<p align="center">
<img src="https://github.com/maxershov/telegram-youtube-bot/blob/master/screenshots/s0.jpg" width="60%">
</p>

Run chrome browser with Youtube Music and change tracks with telegram bot. Run ```npm i``` and set ```TOKEN``` and ```CHROME_PATH``` in ```bot.js```. Run ```npm start``` to start bot and open browser.



**Цель:**

Контроль над проигрываемой музыкой. Через Telegram бот с программой могут взаимодействовать сразу **несколько человек**. Позволяет включать следующий трек из плейлиста, выбирать плейлист и контролировать громкость. Сам проигрыватель открывается через Puppeteer. Использован сервис Youtube Music (в аудиосистеме умер bluetooth - пришлось быстро собрать альтернативу из костылей и палок). Используется в спортивном клубе (вывод изображения на второй экран с ТВ для клипов, доступ к боту только у сотрудников).

Из-за недавней разблокировки Telegram на территории РФ, больше не нужно встраивать прокси для работы локального сервера!

Для начала работы:

Введите ```npm i``` и добавьте ```TOKEN``` и ```CHROME_PATH``` в ```bot.js```. Запустите ```npm start``` для запуска бота и открытия браузера

