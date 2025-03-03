
const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al mundo del renderizado
contextBridge.exposeInMainWorld('electron', {
  // Enviar mensajes desde Renderer a Main
  send: (channel, ...args) => {
    // Canales permitidos para send
    const validSendChannels = [
      'mt4-command',
      'progress-update',
      'run-mt4',
      'cancel-backtest'
    ];
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  
  // Invocar métodos desde Renderer a Main y recibir respuesta
  invoke: (channel, ...args) => {
    // Canales permitidos para invoke
    const validInvokeChannels = [
      'select-directory',
      'select-files',
      'select-excel',
      'mt4-command',
      'mt4-result',
      'generate-excel',
      'update-excel',
      'ensure-directory',
      'get-documents-path',
      'get-mt4-terminals',
      'open-file-explorer',
      'detect-installed-mt4'
    ];
    if (validInvokeChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Canal no permitido: ${channel}`));
  }
});

// También podemos escuchar eventos del proceso principal
ipcRenderer.on('progress-update', (event, data) => {
  // Dispatch a custom event that the renderer can listen to
  window.dispatchEvent(new CustomEvent('progress-update', { detail: data }));
});

ipcRenderer.on('mt4-result', (event, data) => {
  window.dispatchEvent(new CustomEvent('mt4-result', { detail: data }));
});

ipcRenderer.on('mt4-error', (event, data) => {
  window.dispatchEvent(new CustomEvent('mt4-error', { detail: data }));
});
