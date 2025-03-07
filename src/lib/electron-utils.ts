
/**
 * Utility functions for Electron integration
 */

/**
 * Check if the app is running in Electron
 */
export const isElectronApp = (): boolean => {
  return typeof window !== 'undefined' && window?.electron?.isElectron?.() === true;
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
 * Falls back gracefully in web environment
 */
export const sendToElectron = (channel: string, data?: any): void => {
  if (isElectronApp()) {
    window.electron.send(channel, data);
  } else {
    console.log(`[Web Mode] Send to channel "${channel}":`, data);
  }
};

/**
 * Register a listener for messages from the Electron main process
 * Provides a mock implementation for web environment
 * Returns a function to remove the listener
 */
export const listenToElectron = (channel: string, callback: (...args: any[]) => void): (() => void) => {
  if (isElectronApp()) {
    return window.electron.receive(channel, callback);
  }
  
  // In web mode, create a custom event to simulate some Electron events
  if (channel === 'progress-update') {
    const handler = (event: Event) => {
      if (event instanceof CustomEvent) {
        callback(event.detail);
      }
    };
    
    window.addEventListener('progress-update', handler);
    return () => window.removeEventListener('progress-update', handler);
  }
  
  console.log(`[Web Mode] Registered listener for channel "${channel}"`);
  return () => {}; // Return empty cleanup function
};

/**
 * Invoke an Electron method and get a response
 * Provides mock responses for web environment
 */
export const invokeElectron = async (channel: string, data?: any): Promise<any> => {
  if (isElectronApp()) {
    return window.electron.invoke(channel, data);
  }
  
  // Simulate responses for specific channels in web mode
  console.log(`[Web Mode] Invoke channel "${channel}":`, data);
  
  // Simulate get-mt4-terminals
  if (channel === 'get-mt4-terminals') {
    return {
      data: [
        'C:\\Program Files\\Darwinex MT4\\terminal.exe',
        'C:\\Program Files\\MetaTrader 4\\terminal.exe',
        'C:\\Users\\Usuario\\AppData\\Roaming\\MetaQuotes\\Terminal\\1B80A8D8FC5F405C891BF1E1E5185D92\\terminal.exe'
      ]
    };
  }
  
  // Simulate ensure-directory
  if (channel === 'ensure-directory') {
    return { success: true };
  }
  
  // Simulate generic success
  return { success: true, data: null };
};
