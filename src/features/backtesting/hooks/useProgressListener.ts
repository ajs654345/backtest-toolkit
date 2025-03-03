
import { useEffect } from 'react';

interface UseProgressListenerProps {
  setProgress: (progress: number) => void;
  setCurrentTask: (task: string) => void;
}

export const useProgressListener = ({ setProgress, setCurrentTask }: UseProgressListenerProps) => {
  useEffect(() => {
    const handleProgressUpdate = (event: any) => {
      const data = event.detail;
      setProgress(data.progress);
      setCurrentTask(`${data.robot} - ${data.pair} (${data.current}/${data.total})`);
    };

    if (window.electron) {
      // Configurar listener para actualización de progreso
      window.addEventListener('progress-update', handleProgressUpdate);
    }
    
    // Limpieza
    return () => {
      if (window.electron) {
        window.removeEventListener('progress-update', handleProgressUpdate);
      }
    };
  }, [setProgress, setCurrentTask]);
};
