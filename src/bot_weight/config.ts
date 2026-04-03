import * as dotenv from 'dotenv';

dotenv.config();
export const TOKEN = process.env.BOT_WEIGHT_TOKEN || '';
if(!TOKEN) {throw new Error('Missing BOT_WEIGHT_TOKEN in environment variables.');}

export const HELP_MESSAGE = `
⚖️ *Weight Tracker*

Track your weight using simple shorthand commands!

*How to log weight:*
Send a message like: \`76.5\`
This logs your weight as 76.5 kg.

*How to view stats:*
\`.report\` - Shows a report of your weight changes over time.

*Commands:*
/help - Show this message 
`.trim();