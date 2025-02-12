
import { toast } from "@/components/ui/use-toast";

export class MT4Error extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'MT4Error';
  }
}

export const handleError = (error: Error): void => {
  console.error('Error details:', error);

  let title = 'Error';
  let description = 'Ha ocurrido un error inesperado';

  if (error instanceof MT4Error) {
    title = 'Error de MT4';
    description = error.message;
  } else if (error.name === 'ValidationError') {
    title = 'Error de Validación';
    description = error.message;
  }

  toast({
    title,
    description,
    variant: "destructive",
  });
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    handleError(error);
    throw error;
  }
};
