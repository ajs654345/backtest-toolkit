
const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Remove "type": "module" if it exists
if (packageJson.type === 'module') {
  delete packageJson.type;
}

// Add scripts needed for Electron
packageJson.scripts = {
  ...packageJson.scripts,
  "dev": "vite",
  "build": "tsc && vite build",
  "electron:dev": "concurrently \"npm run dev\" \"electron electron/main.js\"",
  "electron:build": "npm run build && electron-builder",
  "electron:package": "npm run build && electron-builder -mwl",
  "electron:win": "npm run build && electron-builder --win"
};

// Save the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ package.json updated: removed "type": "module" and added scripts for Electron');
