const TelegramBot = require('node-telegram-bot-api');
const token = '652865552:AAHFE9Slm1mQw0kqV21ivMQjdAt-xKlb0i4';
const bot = new TelegramBot(token, {polling: true});
let url = `https://privat24.privatbank.ua/p24/accountorder?oper=prp&PUREXML&apicour&country=ru`;
const request = require('request');
bot.onText(/\/course/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Выберете валюту',{
    reply_markup:{
      inline_keyboard:[[
        {
          text: 'USD',
          callback_data: 'USD'
        },
        {
          text: 'EUR',
          callback_data: 'EUR'
        },
        {
          text: 'Биток',
          callback_data:'BTC'
        }
      ]
    ]
    }
  });
});

bot.on('callback_query', query => {
  const id = query.message.chat.id;
  request(url, function(error, response, body) {
    const data = JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
     let final = `
     Покупка: ${result.buy},
     Продажа: ${result.sale}.
     `;

    bot.sendMessage(id, final, {parse_mode:'Markdown'});
  })
})
