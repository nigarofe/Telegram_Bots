// npx tsx --watch code_bundler/index.ts

import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';

// Added interfaces for better TypeScript support
interface BundleConfig {
    files: string[];
}

interface Config {
    [key: string]: BundleConfig;
}

const config: Config = {
    codeBundle_1: {
        files: [
            'src/bot_weight/config.ts',
            'src/bot_weight/data.csv',
            'src/bot_weight/index.ts',
            'src/bot_weight/storage.ts'
        ],
    }
}

// 1. Run the initial bundle
bundleCode(config);

// 2. Start watching for changes
watchFiles(config);

/**
 * Handles the logic for building a specific bundle.
 * Extracted so it can be used by both the initial run and the watcher.
 */
function buildBundle(bundleName: string, files: string[]) {
    let bundledCode = '';

    files.forEach((relativePath: string) => {
        const absolutePath = path.resolve(process.cwd(), relativePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }

        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        bundledCode += `// --- START OF FILE: ${relativePath} ---\n${fileContent}\n\n`;
    });

    const outputPath = path.join(process.cwd(), 'code_bundler', `${bundleName}.txt`);
    fs.writeFileSync(outputPath, bundledCode);
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Success!`);
}

/**
 * Loops through the config to do the initial build for all bundles.
 */
function bundleCode(config: Config) {
    for (const bundleName in config) {
        buildBundle(bundleName, config[bundleName].files);
    }
}

/**
 * Sets up file watchers for all files defined in the config using chokidar.
 */
function watchFiles(config: Config) {
    console.clear();
    console.log('\n👀 Code bundler is watching files for changes...');

    for (const bundleName in config) {
        const files = config[bundleName].files;

        // Resolve all relative paths to absolute paths for chokidar
        const absolutePaths = files.map(relativePath => path.resolve(process.cwd(), relativePath));

        // Initialize chokidar watcher for the array of files
        const watcher = chokidar.watch(absolutePaths, {
            persistent: true,
            ignoreInitial: true // Prevent triggering 'add' events on startup since we already ran bundleCode()
        });

        // Debounce timer to prevent multiple triggers on a rapid save sequence
        let timeout: NodeJS.Timeout | null = null;

        watcher.on('change', (changedPath) => {
            // Clear the terminal
            console.clear();
            console.log('\n👀 Code bundler is watching files for changes...');

            // Clear the previous timer if it exists
            if (timeout) clearTimeout(timeout);

            // Set a new timer to execute the build after 100ms of inactivity
            timeout = setTimeout(() => {
                // Get the relative path back for claeaner logging
                const relativePath = path.relative(process.cwd(), changedPath);

                console.log(`\n[${new Date().toLocaleTimeString()}] ✏️  File changed: ${relativePath}. Re-bundling ${bundleName}...`);
                try {
                    buildBundle(bundleName, files);
                } catch (error: any) {
                    console.error(`Error during re-bundling: ${error.message}`);
                }
            }, 100);
        });

        watcher.on('error', error => console.error(`Watcher error: ${error}`));
    }
}