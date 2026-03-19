const fs = require('fs');
const path = require('path');

/**
 * Recursively deletes .js and .d.ts files in a directory.
 * @param {string} dir - The directory to search.
 */
function cleanupDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively enter subdirectories (excluding node_modules)
            if (file !== 'node_modules') {
                cleanupDirectory(filePath);
            }
        } else {
            const isDefinitionFile = file.endsWith('.d.ts');
            const isJavaScriptFile = file.endsWith('.js');
            const isSourceFile = file.endsWith('.ts') && !isDefinitionFile;
            const isTsxFile = file.endsWith('.tsx');

            // Logic: Delete if it's .js or .d.ts, but ONLY if it's not a source .ts/.tsx
            // Note: .d.ts ends with .ts, so we check for definition specifically first.
            if ((isJavaScriptFile || isDefinitionFile) && !isTsxFile && !isSourceFile) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted: ${filePath}`);
                } catch (err) {
                    console.error(`Error deleting ${filePath}:`, err.message);
                }
            }
        }
    });
}

// Get the target directory from command line or use current directory
const targetDir = "./src/renderer/src";
console.log(`Starting cleanup in: ${path.resolve(targetDir)}`);
cleanupDirectory(targetDir);
console.log('Cleanup complete.');
