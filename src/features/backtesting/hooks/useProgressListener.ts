
import { useEffect } from 'react';
import { isElectronApp, listenToElectron } from '@/lib/electron-utils';

interface UseProgressListenerProps {
  setProgress: (progress: number) => void;
  setCurrentTask: (task: string) => void;
}

export const useProgressListener = ({
  setProgress,
  setCurrentTask
}: UseProgressListenerProps) => {
  useEffect(() => {
    // Listener para progreso en Electron
    let removeElectronListener = () => {};
    
    if (isElectronApp()) {
      removeElectronListener = listenToElectron('progress-update', (data) => {
        if (data?.progress !== undefined) {
          // Asegurar que el progreso es un número entre 0 y 100
          const progressValue = Math.max(0, Math.min(100, Number(data.progress)));
          setProgress(progressValue);
        }
        
        if (data?.robot && data?.pair) {
          setCurrentTask(`Procesando ${data.robot} en ${data.pair}`);
        }
      });
    } else {
      // En modo web, escuchamos el evento personalizado
      const handleWebProgress = (event: CustomEvent) => {
        const data = event.detail;
        
        if (data?.progress !== undefined) {
          // Asegurar que el progreso es un número entre 0 y 100
          const progressValue = Math.max(0, Math.min(100, Number(data.progress)));
          setProgress(progressValue);
        }
        
        if (data?.robot && data?.pair) {
          setCurrentTask(`Procesando ${data.robot} en ${data.pair}`);
        }
      };
      
      window.addEventListener('backtest-progress', handleWebProgress as EventListener);
      
      return () => {
        window.removeEventListener('backtest-progress', handleWebProgress as EventListener);
      };
    }
    
    return () => {
      removeElectronListener();
    };
  }, [setProgress, setCurrentTask]);
};
