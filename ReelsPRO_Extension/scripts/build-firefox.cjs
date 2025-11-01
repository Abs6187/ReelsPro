#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Firefox extension...');

// Create build directory
const buildDir = 'build-firefox';
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir);

// Create src directory in build
const srcDir = path.join(buildDir, 'src');
fs.mkdirSync(srcDir, { recursive: true });

// Copy Firefox manifest as manifest.json (at root level)
fs.copyFileSync('manifest-firefox.json', path.join(buildDir, 'manifest.json'));

// Copy Firefox background script to src/background.js
fs.copyFileSync('src/background-firefox.js', path.join(srcDir, 'background.js'));

// Copy other required files to src/
const filesToCopy = [
    'src/constants.js',
    'src/translations.js', 
    'src/popup.html',
    'src/popup.js'
];

filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        const dest = path.join(srcDir, path.basename(file));
        fs.copyFileSync(file, dest);
    }
});

// Copy directories maintaining structure
const dirsToCopy = [
    { src: 'dist', dest: 'dist' },
    { src: 'src/assets', dest: 'src/assets' },
    { src: 'src/modules', dest: 'src/modules' },
    { src: 'tfjs', dest: 'tfjs' }
];

dirsToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
        const destPath = path.join(buildDir, dest);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.cpSync(src, destPath, { recursive: true });
    }
});

// Create ZIP package with correct structure
console.log('Creating Firefox package...');
try {
    // Change to build directory and zip contents, not the directory itself
    execSync(`cd ${buildDir} && bestzip ../extension-firefox.zip *`, { cwd: process.cwd(), shell: true });
    console.log('Firefox extension packaged successfully!');
} catch (error) {
    console.error('Error creating Firefox package:', error.message);
    process.exit(1);
}

// Clean up build directory
fs.rmSync(buildDir, { recursive: true });

console.log('Firefox build complete!');