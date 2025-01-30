import ExcelJS from 'exceljs';
import path from 'path';

interface BacktestResult {
  robotName: string;
  pair: string;
  date: string;
  profit: number;
  trades: number;
  winRate: number;
}

export const saveBacktestResults = async (
  results: BacktestResult[],
  outputPath: string,
  useExistingExcel: boolean,
  existingExcelPath?: string
) => {
  const workbook = new ExcelJS.Workbook();
  
  if (useExistingExcel && existingExcelPath) {
    await workbook.xlsx.readFile(existingExcelPath);
  }
  
  const worksheet = workbook.addWorksheet(`Backtest ${new Date().toISOString().split('T')[0]}`);
  
  // Configurar encabezados
  worksheet.columns = [
    { header: 'Robot', key: 'robot' },
    { header: 'Par', key: 'pair' },
    { header: 'Fecha', key: 'date' },
    { header: 'Beneficio', key: 'profit' },
    { header: 'Operaciones', key: 'trades' },
    { header: 'Win Rate', key: 'winRate' }
  ];
  
  // Añadir datos
  results.forEach(result => {
    worksheet.addRow({
      robot: result.robotName,
      pair: result.pair,
      date: result.date,
      profit: result.profit,
      trades: result.trades,
      winRate: `${result.winRate}%`
    });
  });
  
  // Dar formato
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach(column => {
    column.width = 15;
  });
  
  // Guardar archivo
  const fileName = path.join(outputPath, `backtest_results_${new Date().toISOString().split('T')[0]}.xlsx`);
  await workbook.xlsx.writeFile(fileName);
  
  return fileName;
};