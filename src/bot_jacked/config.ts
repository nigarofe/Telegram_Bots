import * as dotenv from 'dotenv';

dotenv.config();

export const TOKEN = process.env.BOT_JACKED_TOKEN || '';
if (!TOKEN) {
    console.error('Missing BOT_JACKED_TOKEN in environment variables.');
    process.exit(1);
}

export const MUSCLE_GROUPS = [
    'biceps', 'triceps', 'shoulders', 'chest', 'back', 'abs',
    'hamstrings', 'quadriceps', 'glutes', 'abductors', 'adductors', 'calves'
];

export const HELP_MESSAGE = `
💪 *Workout Tracker*

Track your workout sets using simple shorthand commands!

*How to log sets:*
Send a message like: \`.biceps4\`
This logs 4 sets for biceps. Add optional notes on lines below the command!

*How to view stats:*
\`.biceps\` - Shows your sets for the last 7 days, hours since last workout, and recent notes.
\`.all\` - Shows a table of all muscle groups.

*Available muscle groups:*
${MUSCLE_GROUPS.map(g => `.${g}`).join('\n')}

*Commands:*
/help - Show this message 
`.trim();