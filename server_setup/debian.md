# Setup on Debian-based Linux
1. sudo apt install gh git -y
2. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
3. (Run the command at the end of the nvm installation script to load nvm into the current shell)
4. nvm install --lts
5. gh auth login
6. gh auth setup-git
7. git config --global user.name "nigarofe" && git config --global user.email "nigarofe@gmail.com"
8. git clone https://github.com/nigarofe/Telegram_Bots.git
9. cd Telegram_Bots
10. npm install
11. echo -e "BOT_JACKED_TOKEN=value\nBOT_WEIGHT_TOKEN=value" > .env

## Additional information for commands:
**gh:** https://github.com/cli/cli/blob/trunk/docs/install_linux.md#debian
**nvm:** https://github.com/nvm-sh/nvm





# screen
**Create a new screen session without attaching:**
1. cd Telegram_Bots
2. screen -S bot_jacked -d -m npm run bot_jacked
3. screen -S bot_weight -d -m npm run bot_weight

**Kill all screen sessions:**
killall screen

**Reattach to the screen session:**
screen -d -r bot_jacked
screen -d -r bot_weight




# Update data and push to GitHub
npm run push
**Observation: there's already an automated backup process**