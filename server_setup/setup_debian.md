# Setup on Debian-based Linux
1. sudo apt install gh git -y
2. gh auth login
3. gh auth setup-git
4. git config --global user.name "nigarofe" && git config --global user.email "nigarofe@gmail.com"
5. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
6. nvm install --lts
7. git clone https://github.com/nigarofe/Telegram_Bot.git
8. cd Telegram_Bot
9. echo "TELEGRAM_TOKEN=value" > .env
10. npm install

## Additional information for commands:
**gh:** https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian
**nvm:** https://github.com/nvm-sh/nvm



# Run the bot
npm run dev
cd Telegram_Bot && screen -S telegram_bot -d -m npm run dev



# Update data and push to GitHub
npm run push
**Observation: there's already an automated backup process**



# screen
**Kill all screen sessions:**
killall screen

**Create a new screen session without attaching:**
cd Telegram_Bot && screen -S telegram_bot -d -m npm run dev

**Reattach to the screen session:**
screen -d -r telegram_bot