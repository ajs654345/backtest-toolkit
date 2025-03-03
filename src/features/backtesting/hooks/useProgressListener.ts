
import { useEffect } from 'react';

interface UseProgressListenerProps {
  setProgress: (progress: number) => void;
  setCurrentTask: (task: string) => void;
}

export const useProgressListener = ({ setProgress, setCurrentTask }: UseProgressListenerProps) => {
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      const data = event.detail;
      setProgress(data.progress);
      setCurrentTask(`${data.robot} - ${data.pair} (${data.current}/${data.total})`);
    };

    // Add type casting to addEventListener to handle CustomEvent
    window.addEventListener('progress-update', handleProgressUpdate as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('progress-update', handleProgressUpdate as EventListener);
    };
  }, [setProgress, setCurrentTask]);
};
