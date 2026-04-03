# Personal Fitness Telegram Bots

This repository contains the source code for two Telegram bots designed to help users track their fitness progress: a Workout Tracker (`bot_jacked`) and a Weight Tracker (`bot_weight`). 

---

## 🏋️ Workout Tracker (`bot_jacked`)
This bot helps users track their workout sets for different muscle groups. It uses shorthand codes designed to be quickly typed on a smartphone.

### Logging Workouts
* To log a workout, send a command consisting of a dot, the muscle group name, and the number of sets completed. 
* For example, sending `.biceps4` logs 4 sets for your biceps.
* **Adding Notes:** You can add optional notes about your workout on the lines immediately following your shorthand command. These notes are stored alongside your workout data in a JSON file.

### Viewing Reports
You can view statistics without logging new sets by using the following commands:
* **Specific Muscle Group:** Send the shorthand code without a number (e.g., `.biceps`). The bot will generate a report showing:
    * The total sets completed in the last 7 days.
    * The number of hours since your last set for that group.
    * The average number of sets per week over the last 4 weeks.
    * The average number of sets per workout over the last 4 weeks.
    * Your notes from the last three workouts.
* **All Muscle Groups:** Send `.all` to receive a summary table containing stats for all tracked muscle groups.

### Supported Muscle Groups
You can track the following muscle groups using these exact shorthand codes:
`nf`, `ne`, `ff`, `fe`, `chest`, `back`, `abs`, `biceps`, `triceps`, `shoulders`, `hamstrings`, `quadriceps`, `glutes`, `abductors`, `adductors`.

---

## ⚖️ Weight Tracker (`bot_weight`)
This bot allows users to quickly log and monitor their bodyweight over time.

### Logging Weight
* To log your weight, simply send a message containing your weight as a number. 
* For example, sending `76.5` logs your weight as 76.5 kg. 
* The bot accepts both periods (`.`) and commas (`,`) as decimal separators.

### Viewing Reports
* Send the `.report` command to view a comprehensive breakdown of your weight changes.
* The bot generates a 5-week report that calculates your average weight for each week. 
* It also displays the percentage change in your average weight compared to the previous week.

---

## ⚙️ Configuration & Setup

### Environment Variables
To run these bots, you must configure the following environment variables in your `.env` file:
* `BOT_JACKED_TOKEN`: The Telegram API token for the Workout Tracker.
* `BOT_WEIGHT_TOKEN`: The Telegram API token for the Weight Tracker.

### Authorization
**Important:** Both bots are currently hardcoded to only accept commands from a specific user (Chat ID: `8191447266`). Any other user attempting to interact with the bots will receive an unauthorized message. You must update this Chat ID in the respective `index.ts` files to use the bots yourself.

### Automated Backups
The Workout Tracker bot features an automated backup system utilizing `simple-git`. It is configured to commit and push changes to the repository every 24 hours, notifying the authorized user upon success or failure.