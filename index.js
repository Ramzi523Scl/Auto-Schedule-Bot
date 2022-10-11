
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '5745798158:AAE6IihSFwl1q_2h5jxC09pAD0wP2L8vVN0';

const ramazan = 799306687;
const groop = -806998404;
const bot = new TelegramApi(token, {polling: true});

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/myname', description: 'Мое имя'},
        {command: '/info', description: 'Вся инфомация обо мне'}, 
        {command: '/author', description: 'Инфомация об авторе бота'},
        {command: '/game', description: 'Запустить игру'},
        
    ]);
    
    bot.on('message', async msg => {
        const [text, chatId, userName, lang, firstName, lastName] = [msg.text, msg.chat.id, msg.from.username, msg.from.language_code, msg.from.first_name, msg.from.last_name];
        
        console.log(msg);
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/s/SebastianMF/SebastianMF_002.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в мой бот`);
        }
        if (text === '/myname') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 
                `
Имя: ${firstName},
Фамилие: ${lastName},
Язык: ${(lang === 'ru')? "Русский": 'Не Русский'},
Ник: @${userName},
Номер чата: ${chatId}, 
Ваше сообшение: ${text}
`);

            // return bot.sendMessage(chatId, `Имя ${firstName} ${lastName}`);
        }
        if (text === '/author') {
            return bot.sendMessage(chatId, `Рамазан`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        bot.sendMessage(groop, `${firstName} ${lastName} @${userName} Сообщение: ${text}`);

        return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }

        // console.log(msg);
    })

}
start();