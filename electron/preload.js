
const { contextBridge, ipcRenderer } = require('electron');

// Exponer funcionalidades de Electron al contexto de la ventana
contextBridge.exposeInMainWorld('electron', {
  // Funciones para diálogos de archivos
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  selectExcel: () => ipcRenderer.invoke('select-excel'),
  
  // Funciones para comunicación con MT4
  send: (channel, data) => {
    // Lista blanca de canales permitidos
    const validChannels = ['mt4-command'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  invoke: (channel, data) => {
    const validChannels = ['mt4-command', 'mt4-result', 'generate-excel', 'update-excel'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.reject(new Error('Canal no permitido'));
  },
  
  // Recibir mensajes
  on: (channel, func) => {
    const validChannels = ['progress-update'];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  }
});
