
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el package.json actual
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Agregar scripts necesarios para Electron
packageJson.scripts = {
  ...packageJson.scripts,
  "dev": "vite",
  "build": "tsc && vite build",
  "electron:dev": "concurrently \"npm run dev\" \"electron electron/main.ts\"",
  "electron:build": "npm run build && electron-builder",
  "electron:package": "npm run build && electron-builder -mwl",
  "electron:win": "npm run build && electron-builder --win"
};

// Guardar el package.json actualizado
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ package.json actualizado con scripts para Electron');
