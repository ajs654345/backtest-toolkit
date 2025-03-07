
import { useEffect } from 'react';
import { listenToElectron, isElectronApp } from '@/lib/electron-utils';

interface UseProgressListenerProps {
  setProgress: (progress: number) => void;
  setCurrentTask: (task: string) => void;
}

export const useProgressListener = ({
  setProgress,
  setCurrentTask
}: UseProgressListenerProps) => {
  useEffect(() => {
    // Función para procesar actualizaciones de progreso
    const handleProgressUpdate = (data: any) => {
      const { progress, current, total, robot, pair } = data;
      setProgress(progress);
      setCurrentTask(`Procesando ${robot} en ${pair} (${current}/${total})`);
    };

    let removeListener: (() => void) | null = null;
    
    // Diferentes métodos para Electron y Web
    if (isElectronApp()) {
      // En Electron, utilizamos el IPC
      removeListener = listenToElectron('progress-update', handleProgressUpdate);
    } else {
      // En Web, utilizamos eventos personalizados
      const webHandler = (event: CustomEvent) => handleProgressUpdate(event.detail);
      window.addEventListener('backtest-progress', webHandler as EventListener);
      
      // Retornar función para limpiar el listener
      removeListener = () => {
        window.removeEventListener('backtest-progress', webHandler as EventListener);
      };
    }
    
    // Limpiar al desmontar
    return () => {
      if (removeListener) removeListener();
    };
  }, [setProgress, setCurrentTask]);
};
