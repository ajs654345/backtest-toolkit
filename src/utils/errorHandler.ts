
import { logger } from "@/services/logService";

export class MT4Error extends Error {
  constructor(
    message: string, 
    public details?: any,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'MT4Error';
  }
}

export const handleError = (error: Error, componentName?: string): void => {
  if (error instanceof MT4Error) {
    logger.error(error.message, {
      details: error.details,
      errorCode: error.errorCode,
      stack: error.stack
    }, componentName);
  } else {
    logger.error(error.message, {
      stack: error.stack
    }, componentName);
  }
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  componentName?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(String(error)), componentName);
    throw error;
  }
};
