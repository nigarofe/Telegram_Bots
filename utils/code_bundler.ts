// Version 2026-04-03
// npx tsx --watch code_bundler/index.ts

import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';

const OUTPUT_DIR = path.join(process.cwd(), 'bundled_code');
if (!fs.existsSync(OUTPUT_DIR)) { fs.mkdirSync(OUTPUT_DIR); }

interface Config {
    [key: string]: {
        files: string[];
    };
}

const CONFIG: Config = {
    bundled_code_1: {
        files: [
            'README.md',
            'src/bot_jacked/config.ts',
            'src/bot_jacked/index.ts',
            'src/bot_weight/storage.ts',
            'src/bot_weight/config.ts',
            'src/bot_weight/index.ts',
            'src/bot_weight/storage.ts',
        ],
    },
    bundled_code_2: {
        files: [
            'src/bot_jacked/config.ts',
        ]
    }
};

for (const bundleName in CONFIG) {
    buildBundle(bundleName, CONFIG[bundleName].files);
}

function buildBundle(bundleName: string, files: string[]) {
    let bundledCode = '';

    files.forEach((relativePath: string) => {
        const absolutePath = path.resolve(process.cwd(), relativePath);
        if (!fs.existsSync(absolutePath)) { throw new Error(`File not found: ${absolutePath}`); }
        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        bundledCode += `// --- START OF FILE: ${relativePath} ---\n${fileContent}\n\n`;
    });

    const outputPath = path.join(OUTPUT_DIR, `${bundleName}.txt`);
    fs.writeFileSync(outputPath, bundledCode);
    console.log(`[${new Date().toLocaleTimeString()}] ${bundleName} ready!`);
}

const RUNNING_MESSAGE = `Code bundler is watching files for changes...`;
watchFiles(CONFIG);

function watchFiles(config: Config) {
    console.clear();
    console.log(RUNNING_MESSAGE);

    for (const bundleName in config) {
        const files = config[bundleName].files;
        const absolutePaths = files.map(relativePath => path.resolve(process.cwd(), relativePath));

        const watcher = chokidar.watch(absolutePaths, { persistent: true, ignoreInitial: true });

        let timeout: NodeJS.Timeout | null = null;

        watcher.on('change', (changedPath) => {
            console.clear();
            console.log(RUNNING_MESSAGE);

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(() => {
                const relativePath = path.relative(process.cwd(), changedPath);

                console.log(`[${new Date().toLocaleTimeString()}] File changed: ${relativePath}. Re-bundling ${bundleName}...`);
                buildBundle(bundleName, files);
            }, 100);
        });
        watcher.on('error', error => console.error(`Watcher error: ${error}`));
    }
}