
export interface BacktestCommand {
  dateFrom?: Date;
  dateTo?: Date;
  robots: Array<{
    name: string;
    pairs: string[];
  }>;
  testingMode: string;
  outputPath: string;
  excelConfig: {
    useExisting: boolean;
    fileName: string;
    existingFile?: string;
  };
  mt4Terminal?: string;
}

export interface MT4Result {
  error?: string;
  data?: any;
  success?: boolean;
  message?: string;
}

export interface MT4Command {
  action: string;
  robot: string;
  symbol: string;
  from?: string;
  to?: string;
  mode: string;
  outputPath: string;
  terminal?: string;
}

export interface ExcelUpdateParams {
  filePath?: string;
  resultsPath: string;
  robotData: Array<{
    name: string;
    pairs: string[];
  }>;
}

export interface ExcelGenerateParams extends ExcelUpdateParams {
  fileName: string;
  outputPath: string;
}
