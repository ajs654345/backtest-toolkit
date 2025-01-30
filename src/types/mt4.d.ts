export interface MT4Config {
  robotPath: string;
  dateFrom: string;
  dateTo: string;
  pair: string;
  outputPath: string;
  testingMode: 'control' | 'tick' | 'price';
}