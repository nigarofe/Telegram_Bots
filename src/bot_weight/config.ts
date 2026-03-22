import * as dotenv from 'dotenv';

dotenv.config();

export const TOKEN = process.env.BOT_WEIGHT_TOKEN || '';
if (!TOKEN) {
    console.error('Missing BOT_WEIGHT_TOKEN in environment variables.');
    process.exit(1);
}