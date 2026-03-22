import TelegramBot from 'node-telegram-bot-api';
import { TOKEN, HELP_MESSAGE } from './config';
import { saveWeight, getWeightData } from './storage';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Weight Telegram Bot is running...');

const reply = (chatId: number, text: string) => { bot.sendMessage(chatId, text, { parse_mode: 'Markdown' }); };

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();

    if (text) { console.log(`Received message from ${msg.from?.first_name}: "${text}"`); }
    if (!text) { return reply(chatId, `❌ Please send a text message to log your weight.`); }
    if (text === '/help' || text === '/start') { return reply(chatId, HELP_MESSAGE); }
    if (text === '.report') { return handleReport(chatId); }

    // Regex check to see if the text is a valid number (e.g., "76.5" or "76")
    if (/^\d+(\.\d+)?$/.test(text)) {
        const weight = parseFloat(text);
        saveWeight(weight);
        return reply(chatId, `✅ Successfully logged weight: *${weight} kg*`);
    }

    reply(chatId, `❓ I didn't understand that. Send a number to log your weight, or use /help!`);
});

function handleReport(chatId: number) {
    const data = getWeightData();

    if (data.length === 0) {
        return reply(chatId, '📊 *Weight Report*\n\nNo data available yet. Start by sending your weight!');
    }

    // Calculate the timeframe for the last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter data for the last 7 days
    const last7DaysData = data.filter(entry => entry.datetime >= sevenDaysAgo);

    let reportMsg = '📊 *Weight Report*\n\n';

    if (last7DaysData.length > 0) {
        const sum = last7DaysData.reduce((acc, curr) => acc + curr.bodyweight, 0);
        const avg = (sum / last7DaysData.length).toFixed(2);
        reportMsg += `📅 *7-Day Average:* ${avg} kg\n`;
        reportMsg += `📝 *Logs in last 7 days:* ${last7DaysData.length}\n`;
    } else {
        reportMsg += `📅 *7-Day Average:* N/A (No entries in the last 7 days)\n`;
    }

    // Attach the most recent logged weight at the bottom for reference
    const latestWeight = data[data.length - 1];
    reportMsg += `\n⚖️ *Latest Entry:* ${latestWeight.bodyweight} kg (${latestWeight.datetime.toISOString().split('T')[0]})`;

    reply(chatId, reportMsg);
}