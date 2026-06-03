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
  if (text === 'help' || text === '/start') { return reply(chatId, HELP_MESSAGE); }
  if (text === 'all') { return handleAllReport(chatId); }
  // if the first line of the message matches a muscle group or a muscle group followed by a number, 
  // handle it as a workout command

  const lines = text.split('\n');
  const firstLine = lines[0].trim().toLowerCase();
  const notes = lines.slice(1).join('\n').trim();
  const match = firstLine.match(/^([a-z]+)(\d*)$/);
  if (match && MUSCLE_GROUPS.includes(match[1])) {
    return handleWorkoutCommand(chatId, match[1], match[2], notes);
  } else {
    return reply(chatId, `❌ Unknown muscle group: ${match ? match[1] || firstLine : firstLine}. Use /help to see available muscle groups and how to log workouts.`);
  }
});





function handleAllReport(chatId: number) {
  const upperBodyGroups = ['chest', 'back', 'abs', 'biceps', 'triceps', 'shoulders'];
  const lowerBodyGroups = ['hamstrings', 'quadriceps', 'glutes', 'abductors', 'adductors'];
  const otherGroups = ['neck', 'forearms', 'aerobic', 'isometrics'];

  const formatLine = (group: string) => {
    const stats = getStats(group);
    const capitalizedGroup = group.charAt(0).toUpperCase() + group.slice(1);
    const daysStr = stats.daysSinceLast !== null ? `${stats.daysSinceLast.toFixed(1)}d` : 'N/A';
    return `🔹${capitalizedGroup} - ${daysStr}`;
  };

  const response = [
    '📊 *All Muscle Groups Report*',
    '',
    '*Upper Body*',
    '{upperBody}',
    '',
    '*Lower Body*',
    '{lowerBody}',
    '',
    '*Others*',
    '{others}',
    '',
    '*Description*',
    'Muscle Group - Days Since Last Set'
  ].join('\n')
    .replace('{upperBody}', upperBodyGroups.map(formatLine).join('\n'))
    .replace('{lowerBody}', lowerBodyGroups.map(formatLine).join('\n'))
    .replace('{others}', otherGroups.map(formatLine).join('\n'));

  reply(chatId, response);
}





function handleWorkoutCommand(chatId: number, muscleGroup: string, setsStr: string, notes: string) {
  const capitalizedGroup = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1);

  if (setsStr !== '') {
    // Log the workout
    const sets = parseInt(setsStr, 10);
    addWorkout(muscleGroup, sets, notes);
    return reply(chatId, `✅ Logged ${sets} set${sets > 1 ? 's' : ''} for ${capitalizedGroup}!`);
  }

  // Generate the report
  const stats = getStats(muscleGroup);
  const days = stats.daysSinceLast === null ? 'N/A' : `${stats.daysSinceLast.toFixed(1)}d`;

  // Update the response string to include both new averages
  let response = `📊 *${capitalizedGroup} Report*\n` +
    `You've completed *${stats.weeklySets}* sets in the last 7 days.\n` +
    `Average sets/week (last 4 weeks): *${stats.averageWeeklySets.toFixed(1)}*\n` +
    `Average sets/workout (last 4 weeks): *${stats.averageSetsPerWorkout.toFixed(1)}*\n` +
    `Days since last set: *${days}*`;

  if (stats.recentNotes && stats.recentNotes.length > 0) {
    response += `\n\n*Recent Notes:*\n\n` + stats.recentNotes
      .map(note => `📝 *${note.daysAgo} days ago*\n${note.text}`)
      .join('\n\n');
  }

  reply(chatId, response);
}





const BACKUP_INTERVAL = 7 * 24 * 60 * 60 * 1000;
// const BACKUP_INTERVAL = 30 * 1000; // For testing purposes

setInterval(async () => {
  const now = new Date().toISOString();
  console.log(`⏳ [${now}] Initiating automated repo backup...`);

  try {
    await git.add('.').commit(`Automated repo backup: ${now}`).push();
    reply(8191447266, `✅ [${now}] Repo backup completed successfully.`);
    console.log(`✅ [${now}] Repo backup completed successfully.`);
  } catch (error) {
    reply(8191447266, `❌ [${now}] Repo backup failed. Error: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`❌ [${now}] Repo backup failed:`, error);
  }
}, BACKUP_INTERVAL);