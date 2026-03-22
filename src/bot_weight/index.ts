import TelegramBot from 'node-telegram-bot-api';
import { TOKEN } from './config';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Weight Telegram Bot is running...');

const reply = (chatId: number, text: string) => { bot.sendMessage(chatId, text, { parse_mode: 'Markdown' }); };

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    // const text = msg.text;

    // if (text) { console.log(`Received message from ${msg.from?.first_name}: "${text}"`); }
    // if (!text) { return reply(chatId, `❌ Please send a text message to log your workout.`); }
    // if (text === '/help' || text === '/start') { return reply(chatId, HELP_MESSAGE); }
    // if (text === '.all') { return handleAllReport(chatId); }
    // if (text.startsWith('.')) { return handleWorkoutCommand(chatId, text); }
    reply(chatId, `❓ I didn't understand that. Use /help to see how to track your weight!`);
});