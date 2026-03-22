import * as path from 'path';
import * as fs from 'fs';
import { DatabaseData, WorkoutStats } from './types';

const dataPath = path.join(process.cwd(), 'src', 'bot_jacked', 'data.json');

export function getParsedData(): DatabaseData {
    if (!fs.existsSync(dataPath)) return { workouts: [] };
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data) as DatabaseData;
}

export function addWorkout(muscleGroup: string, sets: number, notes?: string): void {
    const parsedData = getParsedData();
    if (!parsedData.workouts) { parsedData.workouts = []; }

    parsedData.workouts.unshift({
        muscle_group: muscleGroup,
        datetime: new Date().toISOString(),
        sets: sets,
        notes: notes ? notes : undefined
    });
    fs.writeFileSync(dataPath, JSON.stringify(parsedData, null, 4));
}

export function getStats(muscleGroup: string): WorkoutStats {
    const parsedData = getParsedData();
    // Updated default return to include averageSetsPerWorkout
    if (!parsedData || !parsedData.workouts) return { weeklySets: 0, hoursSinceLast: null, averageWeeklySets: 0, averageSetsPerWorkout: 0, recentNotes: [] };

    const now = new Date();
    
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const twentyEightDaysAgo = new Date(now);
    twentyEightDaysAgo.setDate(now.getDate() - 28);

    let weeklySets = 0;
    let fourWeekSets = 0; 
    let fourWeekWorkoutsCount = 0; // <-- Track total workouts in the last 4 weeks
    let latestDate: Date | null = null;
    const groupWorkouts = [];

    for (const workout of parsedData.workouts) {
        if (workout.muscle_group === muscleGroup) {
            const workoutDate = new Date(workout.datetime);
            groupWorkouts.push(workout);

            if (workoutDate >= twentyEightDaysAgo) { 
                fourWeekSets += workout.sets; 
                fourWeekWorkoutsCount++; // <-- Increment workout count
                
                if (workoutDate >= sevenDaysAgo) { 
                    weeklySets += workout.sets; 
                }
            }
            
            if (!latestDate || workoutDate > latestDate) { latestDate = workoutDate; }
        }
    }

    let hoursSinceLast: number | null = null;
    const nowTime = now.getTime();

    if (latestDate) {
        const msDiff = nowTime - latestDate.getTime();
        hoursSinceLast = msDiff / (1000 * 60 * 60);
    }

    groupWorkouts.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    
    const recentNotes = groupWorkouts
        .filter(w => w.notes && w.notes.trim() !== '')
        .slice(0, 3)
        .map(w => {
            const msDiff = nowTime - new Date(w.datetime).getTime();
            const hoursAgo = Math.round(msDiff / (1000 * 60 * 60));
            return { text: w.notes as string, hoursAgo };
        });

    const averageWeeklySets = fourWeekSets / 4;
    // Calculate the average sets per workout (avoiding division by zero)
    const averageSetsPerWorkout = fourWeekWorkoutsCount > 0 ? (fourWeekSets / fourWeekWorkoutsCount) : 0;

    return { weeklySets, hoursSinceLast, averageWeeklySets, averageSetsPerWorkout, recentNotes };
}