
import React, { createContext, useContext, useEffect, useState } from 'react';
import { isElectronApp, getPlatform, sendToElectron, listenToElectron, invokeElectron } from '@/lib/electron-utils';

interface ElectronContextType {
  isElectron: boolean;
  platform: string;
  sendToMain: (channel: string, data?: any) => void;
  listenToMain: (channel: string, callback: (...args: any[]) => void) => () => void;
  invokeMain: (channel: string, data?: any) => Promise<any>;
}

const ElectronContext = createContext<ElectronContextType>({
  isElectron: false,
  platform: 'web',
  sendToMain: () => {},
  listenToMain: () => () => {},
  invokeMain: async () => null,
});

export const useElectron = () => useContext(ElectronContext);

export const ElectronProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElectron] = useState<boolean>(isElectronApp());
  const [platform] = useState<string>(getPlatform());

  useEffect(() => {
    // Log para depuración
    console.log('ElectronProvider inicializado', { 
      isElectron, 
      platform, 
      electronAPI: window.electron ? 'disponible' : 'no disponible' 
    });
  }, [isElectron, platform]);

  // Provide Electron API methods or fallbacks
  const contextValue: ElectronContextType = {
    isElectron,
    platform,
    sendToMain: sendToElectron,
    listenToMain: listenToElectron,
    invokeMain: invokeElectron,
  };

  return (
    <ElectronContext.Provider value={contextValue}>
      {children}
    </ElectronContext.Provider>
  );
};
