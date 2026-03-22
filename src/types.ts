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
    hoursSinceLast: number | null;
    averageWeeklySets: number;
    averageSetsPerWorkout: number; // <-- New property added
    recentNotes: { text: string; hoursAgo: number }[];
}