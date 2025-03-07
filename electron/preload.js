
const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs de Electron a la app web de forma segura
contextBridge.exposeInMainWorld('electron', {
  isElectron: () => true,
  platform: () => process.platform,
  invoke: (channel, data) => {
    const validChannels = [
      'select-directory', 
      'select-files', 
      'select-excel',
      'mt4-command', 
      'mt4-result',
      'generate-excel', 
      'update-excel',
      'get-mt4-terminals',
      'ensure-directory',
      'get-documents-path'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    
    return Promise.reject(new Error(`Canal no permitido: ${channel}`));
  },
  send: (channel, data) => {
    const validChannels = ['mt4-command', 'progress-update'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['progress-update'];
    if (validChannels.includes(channel)) {
      // Eliminar cualquier listener anterior para evitar duplicados
      ipcRenderer.removeAllListeners(channel);
      
      // Convertir el IpcRendererEvent a un evento normal para el navegador
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      
      // Devolver una función para limpiar listener
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
    
    return () => {}; // Devolver una función vacía si el canal no es válido
  }
});

// Script para disparar eventos de progreso desde la web a la ventana principal
window.addEventListener('progress-update', (event) => {
  if (event.detail) {
    const customEvent = new CustomEvent('progress-update', { 
      detail: event.detail 
    });
    window.dispatchEvent(customEvent);
  }
});

// Notificar que el preload se ha cargado correctamente
console.log('Preload script cargado correctamente');
