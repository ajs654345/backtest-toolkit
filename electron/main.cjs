
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

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

  // Determina si estamos en desarrollo o producción
  const isDev = !app.isPackaged;

  if (isDev) {
    console.log('Running in development mode');
    // En desarrollo, carga desde el servidor de Vite
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();
  } else {
    console.log('Running in production mode');
    // En producción, carga desde los archivos construidos
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Log any load errors
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  return win;
};

app.whenReady().then(async () => {
  console.log('App is ready');
  console.log('Current working directory:', process.cwd());
  
  try {
    const mainWindow = await createWindow();
    console.log('Window created successfully');
  } catch (error) {
    console.error('Error creating window:', error);
  }

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
    console.log('Attempting to execute MT4 from:', mt4Path);
    console.log('Configuration:', config);

    exec(`"${mt4Path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing MT4:', error);
        return { success: false, error: error.message };
      }
      console.log('MT4 executed successfully');
      if (stderr) console.error('stderr:', stderr);
      if (stdout) console.log('stdout:', stdout);
    });

    return { success: true };
  } catch (error) {
    console.error('Error in execute-mt4:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});
