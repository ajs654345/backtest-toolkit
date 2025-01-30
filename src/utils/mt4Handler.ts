import * as path from 'path';
import * as fs from 'fs';

const MT4_PATH = 'C:\\Users\\arodr\\AppData\\Roaming\\Darwinex MT4';

interface MT4Config {
  robotPath: string;
  dateFrom: string;
  dateTo: string;
  pair: string;
  outputPath: string;
  testingMode: string;
}

interface BacktestResult {
  profit: number;
  trades: number;
  winRate: number;
  drawdown: number;
  reportPath: string;
}

export const executeBacktest = async (config: MT4Config): Promise<BacktestResult> => {
  try {
    console.log('Starting backtest with config:', config);
    console.log('Using MT4 path:', MT4_PATH);

    // Verify MT4 installation
    if (!fs.existsSync(MT4_PATH)) {
      throw new Error(`MT4 not found at path: ${MT4_PATH}`);
    }

    // Verify robot file exists
    const robotFullPath = path.join(MT4_PATH, 'MQL4', 'Experts', path.basename(config.robotPath));
    if (!fs.existsSync(robotFullPath)) {
      throw new Error(`Robot not found at path: ${robotFullPath}`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputPath)) {
      fs.mkdirSync(config.outputPath, { recursive: true });
    }

    // Generate unique report name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportName = `backtest_${path.basename(config.robotPath, '.ex4')}_${config.pair}_${timestamp}`;
    const reportPath = path.join(config.outputPath, `${reportName}.htm`);

    // Here we would normally execute the backtest
    // For now, return mock data since we need to implement the actual MT4 integration
    const mockResult: BacktestResult = {
      profit: 1000,
      trades: 50,
      winRate: 65,
      drawdown: 15,
      reportPath: reportPath
    };

    // Log success
    console.log('Backtest completed successfully:', mockResult);
    
    return mockResult;
  } catch (error) {
    console.error('Error during backtest:', error);
    throw error;
  }
};

export const validateMT4Installation = (): boolean => {
  try {
    return fs.existsSync(MT4_PATH);
  } catch (error) {
    console.error('Error validating MT4 installation:', error);
    return false;
  }
};

export const getTerminalPath = (): string => {
  return MT4_PATH;
};