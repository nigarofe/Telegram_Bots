import TelegramBot from 'node-telegram-bot-api';
import { TOKEN, MUSCLE_GROUPS, HELP_MESSAGE } from './config';
import { addWorkout, getStats } from './storage';
import { simpleGit } from 'simple-git';

const bot = new TelegramBot(TOKEN, { polling: true });
const git = simpleGit()

console.log('🤖 Jacked Telegram Bot is running...');

const reply = (chatId: number, text: string) => { bot.sendMessage(chatId, text, { parse_mode: 'Markdown' }); };

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (chatId !== 8191447266) { return reply(chatId, `❌ You are not authorized to use this bot.`); }
  const text = msg.text;

  if (text) { console.log(`Received message from ${msg.from?.first_name}: "${text}"`); }
  if (!text) { return reply(chatId, `❌ Please send a text message to log your workout.`); }
  if (text === '/help' || text === '/start') { return reply(chatId, HELP_MESSAGE); }
  if (text === '.all') { return handleAllReport(chatId); }
  if (text.startsWith('.')) { return handleWorkoutCommand(chatId, text); }
  reply(chatId, `❓ I didn't understand that. Use /help to see how to track your workouts!`);
});


function handleAllReport(chatId: number) {
  let response = '📊 *All Muscle Groups Report*\n\n';

  for (const group of MUSCLE_GROUPS) {
    const stats = getStats(group);
    const capitalizedGroup = group.charAt(0).toUpperCase() + group.slice(1);
    const hrsStr = stats.hoursSinceLast !== null ? `${stats.hoursSinceLast.toFixed(1)}h` : 'N/A';
    response += `🔹${capitalizedGroup} - ${stats.weeklySets.toString()} sets - ${hrsStr}\n`;
  }

  response += `\n *Description* \n 1. Muscle Group Name\n 2. Sets in the last 7 days \n 3. Hours Since Last Set\n`;
  reply(chatId, response);
}

function handleWorkoutCommand(chatId: number, text: string) {
  const lines = text.split('\n');
  const firstLine = lines[0].trim();
  const notes = lines.slice(1).join('\n').trim();

  const match = firstLine.match(/^\.([a-z]+)(\d*)$/) || ['', '', ''];
  const muscleGroup = match[1];
  const setsStr = match[2];

  if (!MUSCLE_GROUPS.includes(muscleGroup)) { return reply(chatId, `❌ Unknown muscle group: ${muscleGroup}`); }

  const capitalizedGroup = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1);

  // Log the workout
  if (setsStr !== '') {
    const sets = parseInt(setsStr, 10);
    addWorkout(muscleGroup, sets, notes);
    return reply(chatId, `✅ Logged ${sets} set${sets > 1 ? 's' : ''} for ${capitalizedGroup}!`);
  }

  // Generate the report
  const stats = getStats(muscleGroup);
  const hours = stats.hoursSinceLast === null ? 'N/A' : `${stats.hoursSinceLast.toFixed(1)}h`;

  // Update the response string to include both new averages
  let response = `📊 *${capitalizedGroup} Report*\n` +
    `You've completed *${stats.weeklySets}* sets in the last 7 days.\n` +
    `Average sets/week (last 4 weeks): *${stats.averageWeeklySets.toFixed(1)}*\n` +
    `Average sets/workout (last 4 weeks): *${stats.averageSetsPerWorkout.toFixed(1)}*\n` +
    `Hours since last set: *${hours}*`;

  if (stats.recentNotes && stats.recentNotes.length > 0) {
    response += `\n\n*Recent Notes:*\n\n` + stats.recentNotes
      .map(note => `📝 *${note.hoursAgo} hours ago*\n${note.text}`)
      .join('\n\n');
  }

  reply(chatId, response);
}






// Define 24 hours in milliseconds
const BACKUP_INTERVAL = 24 * 60 * 60 * 1000;
// const BACKUP_INTERVAL = 30 * 1000; // For testing purposes, set to 30 second. Change back to 24 hours for production.

// Set up the recurring backup task
setInterval(async () => {
  const now = new Date().toISOString();
  console.log(`⏳ [${now}] Initiating automated repo backup...`);

  try {
    await git.add('.')
      .commit(`Automated repo backup: ${now}`)
      .push();
    console.log(`✅ [${now}] Repo backup completed successfully.`);
    // Notify the admin about the backup status
    reply(8191447266, `✅ [${now}] Repo backup completed successfully.`);
  } catch (error) {
    console.error(`❌ [${now}] Repo backup failed:`, error);
    // Notify the admin about the backup failure
    reply(8191447266, `❌ [${now}] Repo backup failed. Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}, BACKUP_INTERVAL);