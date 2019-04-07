const dotenv = require('dotenv');
dotenv.config();
const Telegraf = require('telegraf');
const scrapper = require('./scrapper.js');

console.log('Corriendo bot :)');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);
bot.start((ctx) => ctx.reply('Enviame cualquier mensaje y te mando la cotizacion!').catch(e => console.error(e)));
bot.help((ctx) => ctx.reply('No hay ayuda solo pedi la cotizacion :)'));

bot.on('message', (ctx) => {
    console.info('Pedido entrante!');
    ctx.reply('Aguarde unos momentos por favor estamos procesando su pedido.');
    console.info('Procesando pedido');
    scrapper()
        .then(result => {
            console.info('Respondiendo pedido');
            bot.telegram.sendMessage(ctx.from.id, result);
            bot.telegram.sendMessage(ctx.from.id, 'Imagen evidencia');
            bot.telegram.sendPhoto(ctx.from.id, { source: './cotizacion.png' });
        })
        .catch(err => {
            console.log(err);
            console.info('Respondiendo pedido en Error');
            bot.telegram.sendMessage(ctx.from.id, "Ocurrio un error, vuelva intentar en unos minutos");
        })
});

bot.action('delete', ({ deleteMessage }) => deleteMessage());

bot.launch();