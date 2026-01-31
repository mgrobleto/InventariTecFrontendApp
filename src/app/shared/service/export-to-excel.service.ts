import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor() { }

  async ExportToExcelComponent(tableId: string, columnsToInclude: string[], fileName: string) {
    const element = document.getElementById(tableId) as HTMLTableElement;
    if (!element) {
      console.error(`Table with id ${tableId} not found`);
      return;
    }

    const rows = Array.from(element.querySelectorAll('tr'));
    const headers = Array.from(element.querySelectorAll('th'));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    const filteredData = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td')) as HTMLTableCellElement[];
      return columnsToInclude.map(col => {
        const cellIndex = headers.findIndex(header => header.innerText.trim() === col);
        return (cellIndex !== -1 && cells[cellIndex]) ? cells[cellIndex].innerText : '';
      });
    });

    worksheet.addRows(filteredData);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }

  async exportJsonToExcel(
    rows: any[],
    columns: { header: string; key: string; width?: number; numFmt?: string }[],
    fileName: string
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 18
    }));

    worksheet.addRows(rows);

    columns.forEach((col, index) => {
      if (col.numFmt) {
        worksheet.getColumn(index + 1).numFmt = col.numFmt;
      }
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}
