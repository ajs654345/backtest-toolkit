
import { toast } from "@/components/ui/use-toast";

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  componentName?: string;
}

class LogService {
  private logs: LogEntry[] = [];
  private isDebugMode = process.env.NODE_ENV === 'development';

  log(level: LogLevel, message: string, data?: any, componentName?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      componentName,
    };

    this.logs.push(entry);
    
    // Formato del mensaje en consola
    const logPrefix = `[${entry.timestamp}] [${level.toUpperCase()}]${componentName ? ` [${componentName}]` : ''}`;
    
    switch (level) {
      case 'error':
        console.error(logPrefix, message, data || '');
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
        break;
      case 'warning':
        console.warn(logPrefix, message, data || '');
        toast({
          title: "Advertencia",
          description: message,
        });
        break;
      case 'info':
        console.info(logPrefix, message, data || '');
        break;
      case 'debug':
        if (this.isDebugMode) {
          console.debug(logPrefix, message, data || '');
        }
        break;
    }
  }

  error(message: string, data?: any, componentName?: string) {
    this.log('error', message, data, componentName);
  }

  warn(message: string, data?: any, componentName?: string) {
    this.log('warning', message, data, componentName);
  }

  info(message: string, data?: any, componentName?: string) {
    this.log('info', message, data, componentName);
  }

  debug(message: string, data?: any, componentName?: string) {
    this.log('debug', message, data, componentName);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new LogService();
