
/**
 * Utility functions for Electron integration
 */

/**
 * Check if the app is running in Electron
 */
export const isElectronApp = (): boolean => {
  return window?.electron?.isElectron?.() === true;
};

/**
 * Get the current platform (win32, darwin, linux)
 * Returns 'web' if not running in Electron
 */
export const getPlatform = (): string => {
  if (isElectronApp()) {
    return window.electron.platform();
  }
  return 'web';
};

/**
 * Send a message to the Electron main process
 */
export const sendToElectron = (channel: string, data?: any): void => {
  if (isElectronApp()) {
    window.electron.send(channel, data);
  } else {
    console.log(`Web mode: would send to channel "${channel}"`, data);
  }
};

/**
 * Register a listener for messages from the Electron main process
 * Returns a function to remove the listener
 */
export const listenToElectron = (channel: string, callback: (...args: any[]) => void): (() => void) => {
  if (isElectronApp()) {
    return window.electron.receive(channel, callback);
  }
  console.log(`Web mode: would listen to channel "${channel}"`);
  return () => {}; // Return empty cleanup function
};

/**
 * Invoke a method in the Electron main process and return a promise with the result
 */
export const invokeElectron = async (channel: string, data?: any): Promise<any> => {
  if (isElectronApp()) {
    return window.electron.invoke(channel, data);
  }
  
  console.log(`Web mode: simulation for channel "${channel}"`, data);
  
  // Web mode simulations for specific channels
  if (channel === 'get-mt4-terminals') {
    return {
      data: [
        'Terminal 1 (Simulado)',
        'Terminal 2 (Simulado)',
        'Terminal 3 (Simulado)'
      ]
    };
  }
  
  if (channel === 'ensure-directory') {
    return { success: true };
  }
  
  if (channel === 'get-documents-path') {
    return 'C:/Documents/MT4_Results';
  }
  
  if (channel === 'mt4-result') {
    // Simulate a successful backtesting result
    return { success: true, data: 'Simulación completada en web' };
  }
  
  if (channel === 'generate-excel' || channel === 'update-excel') {
    return { success: true, data: 'Excel simulado en web' };
  }
  
  // Default fallback
  return { success: true, data: null, simulatedInWeb: true };
};
