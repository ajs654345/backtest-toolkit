
import React, { createContext, useContext, useEffect, useState } from 'react';
import { isElectronApp, getPlatform, sendToElectron, listenToElectron, invokeElectron } from '@/lib/electron-utils';
import { toast } from '@/hooks/use-toast';

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
  invokeMain: async () => {
    console.warn('invokeMain called in web context - this is a no-op');
    return null;
  },
});

export const useElectron = () => useContext(ElectronContext);

export const ElectronProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElectron] = useState<boolean>(isElectronApp());
  const [platform] = useState<string>(getPlatform());

  useEffect(() => {
    // Debug log
    console.log('ElectronProvider initialized', { 
      isElectron, 
      platform, 
      electronAPI: window.electron ? 'available' : 'not available',
      electronAPIMethods: window.electron ? Object.keys(window.electron) : []
    });

    if (!isElectron && process.env.NODE_ENV === 'development') {
      console.info('Running in web mode - Electron features will be mocked or disabled');
    }

    // Add an event handler for progress-update
    if (isElectron) {
      try {
        const cleanup = listenToElectron('progress-update', (data) => {
          console.log('Progress-update event received:', data);
          // Dispatch a DOM event so components can listen to it
          const event = new CustomEvent('progress-update', { detail: data });
          window.dispatchEvent(event);
        });
        
        return cleanup;
      } catch (error) {
        console.error('Error setting up Electron event listener:', error);
        toast({
          title: 'Electron Error',
          description: 'Could not initialize electron event listeners',
          variant: 'destructive'
        });
      }
    }
  }, [isElectron, platform]);

  // Provide Electron API methods or fallbacks with better error handling
  const contextValue: ElectronContextType = {
    isElectron,
    platform,
    sendToMain: (channel, data) => {
      try {
        sendToElectron(channel, data);
      } catch (error) {
        console.error(`Error sending to channel ${channel}:`, error);
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: 'Electron Communication Error',
            description: `Failed to send data to ${channel}`,
            variant: 'destructive'
          });
        }
      }
    },
    listenToMain: (channel, callback) => {
      try {
        return listenToElectron(channel, callback);
      } catch (error) {
        console.error(`Error listening to channel ${channel}:`, error);
        return () => {};
      }
    },
    invokeMain: async (channel, data) => {
      try {
        return await invokeElectron(channel, data);
      } catch (error) {
        console.error(`Error invoking ${channel}:`, error);
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: 'Electron Communication Error',
            description: `Failed to invoke ${channel}`,
            variant: 'destructive'
          });
        }
        return null;
      }
    }
  };

  return (
    <ElectronContext.Provider value={contextValue}>
      {children}
    </ElectronContext.Provider>
  );
};
