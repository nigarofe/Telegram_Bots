export interface Workout {
    muscle_group: string;
    datetime: string;
    sets: number;
    notes?: string;
}

export interface DatabaseData {
    workouts: Workout[];
}

export interface WorkoutStats {
    weeklySets: number;
    daysSinceLast: number | null;
    averageWeeklySets: number;
    averageSetsPerWorkout: number; // <-- New property added
    recentNotes: { text: string; daysAgo: number }[];
}