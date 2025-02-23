
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';

function getAssetPath(...paths) {
  return path.join(__dirname, '..', ...paths);
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    try {
      console.log('Intentando cargar servidor de desarrollo...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await win.loadURL('http://localhost:8080');
      win.webContents.openDevTools();
    } catch (error) {
      console.error('Error loading dev server:', error);
    }
  } else {
    const indexPath = getAssetPath('dist', 'index.html');
    console.log('Cargando archivo:', indexPath);
    win.loadFile(indexPath);
  }

  return win;
};

app.whenReady().then(async () => {
  console.log('Directorio actual:', process.cwd());
  console.log('Directorio del archivo:', __dirname);
  
  const mainWindow = await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('execute-mt4', async (_, config) => {
  try {
    const mt4Path = 'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4\\terminal.exe';
    console.log('Intentando ejecutar MT4 desde:', mt4Path);
    console.log('Configuración:', config);

    exec(`"${mt4Path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error al ejecutar MT4:', error);
        return { success: false, error: error.message };
      }
      console.log('MT4 ejecutado correctamente');
      if (stderr) console.error('Error:', stderr);
    });

    return { success: true };
  } catch (error) {
    console.error('Error en execute-mt4:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
});
