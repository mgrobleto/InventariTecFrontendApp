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
}