
export interface MT4Config {
  robotPath: string;
  dateFrom: string;
  dateTo: string;
  pair: string;
  outputPath: string;
  testingMode: 'control' | 'tick' | 'price';
}

export interface BacktestRecord {
  robot_name: string;
  currency_pair: string;
  date_from: string;
  date_to: string;
  testing_mode: string;
  output_path: string;
  created_at?: string;
  id?: string;
}
