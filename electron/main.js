
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');
const os = require('os');

// Mantener una referencia global al objeto window
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    autoHideMenuBar: false,
    title: 'Backtesting Toolkit'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Manejador para seleccionar carpeta de salida
  ipcMain.handle('select-directory', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Seleccionar carpeta de salida'
    });
    
    return result;
  });

  // Manejador para seleccionar archivos de robot
  ipcMain.handle('select-files', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Robot Files', extensions: ['set'] }],
      title: 'Seleccionar archivos de robot'
    });
    
    return result;
  });

  // Manejador para seleccionar archivo Excel existente
  ipcMain.handle('select-excel', async () => {
    if (!mainWindow) return { canceled: true };
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
      title: 'Seleccionar archivo Excel'
    });
    
    return result;
  });

  // Manejador para obtener la ruta de documentos
  ipcMain.handle('get-documents-path', () => {
    return path.join(os.homedir(), 'Documents', 'MT4_Backtest_Results');
  });

  // Manejador para asegurar que un directorio existe
  ipcMain.handle('ensure-directory', async (event, { path: dirPath }) => {
    if (!dirPath) return { error: 'No se proporcionó una ruta' };
    
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return { success: true };
    } catch (error) {
      return { error: `Error al crear directorio: ${error.message}` };
    }
  });

  // Manejador para comandos MT4
  ipcMain.handle('mt4-command', async (event, command) => {
    console.log('Comando MT4 recibido:', command);
    
    try {
      // Construir el comando para el terminal MT4
      const mt4Path = command.mt4Terminal || 'C:\\Program Files (x86)\\MetaTrader 4\\terminal.exe';
      
      // Validar que el archivo terminal.exe existe
      if (!fs.existsSync(mt4Path)) {
        return { error: `No se encontró el terminal MT4 en: ${mt4Path}` };
      }
      
      // Construir los argumentos para MT4
      const args = [
        `/config:"${command.configPath || 'default'}"`,
        `/symbol:${command.symbol}`,
        `/backtest`,
        `/period:H1`
      ];
      
      if (command.from && command.to) {
        const fromDate = new Date(command.from);
        const toDate = new Date(command.to);
        args.push(`/fromdate:${formatDate(fromDate)}`);
        args.push(`/todate:${formatDate(toDate)}`);
      }
      
      if (command.expert) {
        args.push(`/expert:${command.expert}`);
      }
      
      // Ejecutar MT4 con los argumentos
      const mt4Command = `"${mt4Path}" ${args.join(' ')}`;
      console.log('Ejecutando comando:', mt4Command);
      
      exec(mt4Command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar MT4: ${error.message}`);
          if (mainWindow) {
            mainWindow.webContents.send('mt4-status', { 
              error: `Error al ejecutar MT4: ${error.message}` 
            });
          }
          return;
        }
        
        console.log('MT4 ejecutado correctamente');
        console.log('Stdout:', stdout);
        
        if (stderr) {
          console.error('Stderr:', stderr);
        }
        
        if (mainWindow) {
          mainWindow.webContents.send('mt4-status', { 
            success: true,
            message: 'MT4 ejecutado correctamente',
            output: stdout
          });
        }
      });
      
      return { success: true, message: 'Comando enviado a MT4' };
    } catch (error) {
      console.error('Error al procesar comando MT4:', error);
      return { error: `Error al procesar comando MT4: ${error.message}` };
    }
  });

  // Manejador para resultados MT4
  ipcMain.handle('mt4-result', async () => {
    try {
      // Aquí se procesaría el resultado real del backtesting
      // Por ahora devolvemos un resultado simulado
      return { data: 'Backtesting completado' };
    } catch (error) {
      return { error: `Error al obtener resultados: ${error.message}` };
    }
  });

  // Manejador para obtener terminales MT4 instalados
  ipcMain.handle('get-mt4-terminals', async () => {
    try {
      const commonPaths = [
        'C:\\Program Files\\MetaTrader 4\\terminal.exe',
        'C:\\Program Files (x86)\\MetaTrader 4\\terminal.exe',
        'C:\\Program Files\\MetaTrader 4 Terminal\\terminal.exe'
      ];
      
      // Buscar en las rutas comunes
      const foundPaths = commonPaths.filter(path => fs.existsSync(path));
      
      // También se podría buscar en el registro de Windows para instalaciones personalizadas
      
      return { data: foundPaths };
    } catch (error) {
      console.error('Error al buscar terminales MT4:', error);
      return { error: `Error al buscar terminales MT4: ${error.message}` };
    }
  });

  // Manejadores para Excel
  ipcMain.handle('generate-excel', async (event, params) => {
    console.log('Generando Excel:', params);
    
    try {
      const outputFilePath = path.join(params.outputPath, `${params.fileName}.xlsx`);
      
      // Aquí iría la lógica real para generar el Excel con los resultados
      // Por ahora, solo simulamos la creación de un archivo
      fs.writeFileSync(outputFilePath, 'Excel generado por Backtesting Toolkit');
      
      return { 
        success: true, 
        message: 'Excel generado correctamente',
        filePath: outputFilePath
      };
    } catch (error) {
      return { error: `Error al generar Excel: ${error.message}` };
    }
  });

  ipcMain.handle('update-excel', async (event, params) => {
    console.log('Actualizando Excel:', params);
    
    try {
      // Aquí iría la lógica real para actualizar el Excel
      // Por ahora solo devolvemos éxito
      return { 
        success: true, 
        message: 'Excel actualizado correctamente',
        filePath: params.filePath
      };
    } catch (error) {
      return { error: `Error al actualizar Excel: ${error.message}` };
    }
  });
});

// Función auxiliar para formatear fechas en formato para MT4
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
