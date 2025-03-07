
interface ElectronAPI {
  send: (channel: string, data?: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => () => void;
  platform: () => string;
  isElectron: () => boolean;
  invoke: (channel: string, data?: any) => Promise<any>;
}

// Add Electron API to Window interface
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
