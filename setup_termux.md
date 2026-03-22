# Setup on Termux on Android
1. pkg install nodejs-lts gh git sudo
2. gh auth login
3. gh auth setup-git
4. git config --global user.name "nigarofe" && git config --global user.email "nigarofe@gmail.com"
5. git clone https://github.com/nigarofe/Telegram_Bot.git
6. cd Telegram_Bot
7. echo "TELEGRAM_TOKEN=value" > .env
8. npm install

# Run the bot
npm run dev

# Update data and push to GitHub
npm run push


