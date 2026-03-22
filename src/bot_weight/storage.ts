import * as fs from 'fs';
import * as path from 'path';

const CSV_PATH = path.join(process.cwd(), 'src', 'bot_weight', 'data.csv');

export interface WeightEntry {
    datetime: Date;
    bodyweight: number;
}

// Function to register and save the new weight log
export function saveWeight(weight: number): void {
    const date = new Date().toISOString();
    const line = `${date},${weight}\n`;

    // Create the file with a header if it doesn't exist yet
    if (!fs.existsSync(CSV_PATH)) {
        fs.writeFileSync(CSV_PATH, 'datetime,bodyweight\n');
    }

    fs.appendFileSync(CSV_PATH, line);
}

// Function to read and parse the existing weight logs
export function getWeightData(): WeightEntry[] {
    if (!fs.existsSync(CSV_PATH)) {
        return [];
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.trim().split('\n');

    const data: WeightEntry[] = [];

    // Start at index 1 to skip the "datetime,bodyweight" header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [dateStr, weightStr] = line.split(',');
        const weight = parseFloat(weightStr);

        if (!isNaN(weight)) {
            data.push({
                datetime: new Date(dateStr),
                bodyweight: weight
            });
        }
    }

    return data;
}