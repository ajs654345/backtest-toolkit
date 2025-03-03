
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

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

console.log('✅ package.json updated with scripts for Electron');
