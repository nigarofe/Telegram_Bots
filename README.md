# Introduction
This is a Telegram bot that helps a user track their workout sets for different muscle groups. The bot allows users to quickly input the number of sets they have completed for each muscle group using shorthand codes.


# Shorthand code
The shorthand codes are designed to be quick to type on a smartphone. They consist of a dot, followed by a muscle group and the number of sets. For example, if you want to set 4 sets for biceps, you can use the command: ".biceps4"

## Report
If the user wants to see a report for a muscle group without logging a new workout, they can simply send the shorthand code without a number (e.g., ".biceps"). The bot will then generate a report showing:
1. the total sets completed in the last 7 days
2. the hours since the last set for that muscle group
3. the average number of sets per week for the last 4 weeks
4. the average number of sets per workout for the last 4 weeks
5. the notes from the last three workouts for that muscle group.

## Muscle groups
List of available shorthand codes for muscle groups:
.biceps
.triceps
.shoulders
.chest
.back
.hamstrings
.quadriceps
.glutes
.calves

# Annotations
After doing a workout, the user will send a message containg the shorthand code in the first line, an then optional notes in the following lines. These notes will be stored in the JSON file along with the workout data. The notes of the last three workouts will be shown in the report when the user sends a message with only the muscle group (e.g., ".biceps"). This allows the user to keep track of their progress and any relevant information about their workouts.
