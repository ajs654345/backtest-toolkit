
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
    console.warn(`Cannot send to channel "${channel}" - not running in Electron`);
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
  console.warn(`Cannot listen to channel "${channel}" - not running in Electron`);
  return () => {}; // Return empty cleanup function
};

/**
 * Invoke a method in the Electron main process and return a promise with the result
 */
export const invokeElectron = async (channel: string, data?: any): Promise<any> => {
  if (isElectronApp()) {
    return window.electron.invoke(channel, data);
  }
  console.warn(`Cannot invoke channel "${channel}" - not running in Electron`);
  return null;
};
