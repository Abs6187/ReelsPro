#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Chrome extension...');

// Create build directory
const buildDir = 'build-chrome';
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir);

// Copy Chrome manifest
fs.copyFileSync('manifest.json', path.join(buildDir, 'manifest.json'));

// Copy Chrome background script
fs.copyFileSync('src/background.js', path.join(buildDir, 'background.js'));

// Copy other required files
const filesToCopy = [
    'src/constants.js',
    'src/translations.js', 
    'src/popup.html',
    'src/popup.js',
    'src/offscreen.html',
    'src/offscreen.js'
];

filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
        const dest = path.join(buildDir, path.basename(file));
        fs.copyFileSync(file, dest);
    }
});

// Copy directories
const dirsToCopy = [
    { src: 'dist', dest: 'dist' },
    { src: 'src/assets', dest: 'assets' },
    { src: 'src/modules', dest: 'modules' },
    { src: 'tfjs', dest: 'tfjs' }
];

dirsToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
        fs.cpSync(src, path.join(buildDir, dest), { recursive: true });
    }
});

// Create ZIP package
console.log('Creating Chrome package...');
try {
    execSync(`bestzip extension-chrome.zip ${buildDir}/*`, { cwd: process.cwd() });
    console.log('Chrome extension packaged successfully!');
} catch (error) {
    console.error('Error creating Chrome package:', error.message);
    process.exit(1);
}

// Clean up build directory
fs.rmSync(buildDir, { recursive: true });

console.log('Chrome build complete!');