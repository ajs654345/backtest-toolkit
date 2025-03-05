
// Cambio a sintaxis ESM
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al package.json
const packageJsonPath = path.join(__dirname, '../package.json');

// Leer el package.json actual
const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonData);

// Eliminar "type": "module" si existe
if (packageJson.type === 'module') {
  delete packageJson.type;
  console.log('✅ Removed "type": "module" from package.json');
}

// Actualizar los scripts para Electron con concurrently
packageJson.scripts = {
  ...packageJson.scripts,
  "dev": "vite",
  "build": "tsc && vite build",
  "electron:dev": "concurrently \"cross-env NODE_ENV=development vite --host 0.0.0.0 --port 8080\" \"cross-env NODE_ENV=development electron electron/main.js\"",
  "electron:build": "npm run build && electron-builder",
  "electron:package": "npm run build && electron-builder -mwl",
  "electron:win": "npm run build && electron-builder --win"
};

// Guardar el package.json actualizado
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Added/updated Electron scripts in package.json');
console.log('✅ Run "npm run electron:dev" to start development mode');
