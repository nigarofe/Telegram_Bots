// --- START OF FILE: src/bot_weight/index.ts ---
import TelegramBot from 'node-telegram-bot-api';
import { TOKEN, HELP_MESSAGE } from './config';
import { saveWeight, getWeightData } from './storage';

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('🤖 Weight Telegram Bot is running...');

const reply = (chatId: number, text: string) => { bot.sendMessage(chatId, text, { parse_mode: 'Markdown' }); };

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (chatId !== 8191447266) { return reply(chatId, `❌ You are not authorized to use this bot.`); }
    const text = msg.text?.trim();

    if (text) { console.log(`Received message from ${msg.from?.first_name}: "${text}"`); }
    if (!text) { return reply(chatId, `❌ Please send a text message to log your weight.`); }
    if (text === '/help' || text === '/start') { return reply(chatId, HELP_MESSAGE); }
    if (text === '.report') { return handleReport(chatId); }

    // Regex check to see if the text is a valid number with either a period or a comma
    if (/^\d+([.,]\d+)?$/.test(text)) {
        // Standardize the decimal separator so Javascript can parse it properly
        const standardizedText = text.replace(',', '.');
        const weight = parseFloat(standardizedText);

        saveWeight(weight);
        reply(chatId, `✅ Successfully logged weight: *${weight} kg*`);
        handleReport(chatId);
        return;
    }

    reply(chatId, `❓ I didn't understand that. Send a number to log your weight, or use /help!`);
});

function handleReport(chatId: number) {
    const data = getWeightData();

    if (data.length === 0) {
        return reply(chatId, '📊 *Weight Report*\n\nNo data available yet. Start by sending your weight!');
    }

    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    // Calculate averages for the last 5 weeks
    const weeksData = [];
    for (let i = 0; i < 5; i++) {
        const start = new Date(now.getTime() - ((i + 1) * 7) * msPerDay);
        const end = new Date(now.getTime() - (i * 7) * msPerDay);

        // Include entries >= start date, and < end date (except for week 1 where we include everything up to now)
        const weekEntries = data.filter(entry =>
            entry.datetime >= start && (i === 0 ? true : entry.datetime < end)
        );

        let avg = 0;
        if (weekEntries.length > 0) {
            const sum = weekEntries.reduce((acc, curr) => acc + curr.bodyweight, 0);
            avg = sum / weekEntries.length;
        }

        weeksData.push({
            weekNum: i + 1,
            entries: weekEntries.length,
            avg
        });
    }

    let reportMsg = '📊 *5-Week Weight Report*\n\n';

    // Loop through the collected data to build the report string
    for (let i = 0; i < 5; i++) {
        const current = weeksData[i];
        const startDay = i * 7;
        const endDay = (i + 1) * 7;

        if (current.entries > 0) {
            reportMsg += `📅 Week ${i + 1} (-${startDay} to -${endDay}d)\n`;
            reportMsg += `   ↳ Average (${current.entries} entries): *${current.avg.toFixed(2)} kg* \n`;
        } else {
            reportMsg += `📅 *Week ${i + 1} (-${startDay} to -${endDay}d):* N/A\n`;
        }

        // Compare with the older week (which is i + 1 in the array)
        if (i < 4) {
            const older = weeksData[i + 1];
            const diffKg = current.avg - older.avg;
            const diffPct = (diffKg / older.avg) * 100;
            const sign = diffKg > 0 ? '+' : '';

            reportMsg += `   ↳ Change from previous week:* ${sign}${diffPct.toFixed(2)}%*\n\n`;
            // reportMsg += `   ↳ 📈 *Diff vs W${i + 2}:* ${sign}${diffKg.toFixed(2)} kg (${sign}${diffPct.toFixed(2)}%)\n\n`;
        }
    }

    // Attach the most recent logged weight at the bottom for reference
    // const latestWeight = data[data.length - 1];
    // reportMsg += `\n⚖️ *Latest Entry:* ${latestWeight.bodyweight} kg (${latestWeight.datetime.toISOString().split('T')[0]})`;

    reply(chatId, reportMsg);
}