
/**
 * Utility functions for Electron integration
 */

/**
 * Check if the app is running in Electron
 */
export const isElectronApp = (): boolean => {
  try {
    return Boolean(window?.electron?.isElectron?.() === true);
  } catch (error) {
    console.warn('Error al verificar si es Electron:', error);
    return false;
  }
};

/**
 * Get the current platform (win32, darwin, linux)
 * Returns 'web' if not running in Electron
 */
export const getPlatform = (): string => {
  try {
    if (isElectronApp()) {
      return window.electron.platform() || 'web';
    }
  } catch (error) {
    console.warn('Error al obtener plataforma:', error);
  }
  return 'web';
};

/**
 * Send a message to the Electron main process
 */
export const sendToElectron = (channel: string, data?: any): void => {
  try {
    if (isElectronApp()) {
      window.electron.send(channel, data);
      console.log(`Mensaje enviado al canal "${channel}"`, data);
    } else {
      console.warn(`No se pudo enviar al canal "${channel}" - no se está ejecutando en Electron`);
    }
  } catch (error) {
    console.error(`Error al enviar mensaje a "${channel}":`, error);
  }
};

/**
 * Register a listener for messages from the Electron main process
 * Returns a function to remove the listener
 */
export const listenToElectron = (channel: string, callback: (...args: any[]) => void): (() => void) => {
  try {
    if (isElectronApp()) {
      console.log(`Escuchando canal "${channel}"`);
      return window.electron.receive(channel, callback);
    }
  } catch (error) {
    console.error(`Error al escuchar canal "${channel}":`, error);
  }
  console.warn(`No se puede escuchar el canal "${channel}" - no se está ejecutando en Electron`);
  return () => {}; // Return empty cleanup function
};

/**
 * Invoke a method in the Electron main process and return a promise with the result
 */
export const invokeElectron = async (channel: string, data?: any): Promise<any> => {
  try {
    if (isElectronApp() && window.electron.invoke) {
      console.log(`Invocando canal "${channel}"`, data);
      return await window.electron.invoke(channel, data);
    }
  } catch (error) {
    console.error(`Error al invocar canal "${channel}":`, error, window.electron);
    throw error;
  }
  console.warn(`No se puede invocar el canal "${channel}" - no se está ejecutando en Electron o el método 'invoke' no está disponible`);
  return null;
};
