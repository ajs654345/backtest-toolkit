
import React, { createContext, useContext, useEffect, useState } from 'react';
import { isElectronApp, getPlatform, sendToElectron, listenToElectron } from '@/lib/electron-utils';

interface ElectronContextType {
  isElectron: boolean;
  platform: string;
  sendToMain: (channel: string, data?: any) => void;
  listenToMain: (channel: string, callback: (...args: any[]) => void) => () => void;
}

const ElectronContext = createContext<ElectronContextType>({
  isElectron: false,
  platform: 'web',
  sendToMain: () => {},
  listenToMain: () => () => {},
});

export const useElectron = () => useContext(ElectronContext);

export const ElectronProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElectron] = useState<boolean>(isElectronApp());
  const [platform] = useState<string>(getPlatform());

  // Provide Electron API methods or fallbacks
  const contextValue: ElectronContextType = {
    isElectron,
    platform,
    sendToMain: sendToElectron,
    listenToMain: listenToElectron,
  };

  return (
    <ElectronContext.Provider value={contextValue}>
      {children}
    </ElectronContext.Provider>
  );
};
