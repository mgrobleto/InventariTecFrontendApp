import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'

@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor() { }

  ExportToExcelComponent(tableId: string, columnsToInclude: string[], fileName: string) {
    const element = document.getElementById(tableId) as HTMLTableElement;
    if (!element) {
      console.log(`Table with id ${tableId} not found`)
    }

    const rows = Array.from(element.querySelectorAll('tr'));
    const headers = Array.from(element.querySelectorAll('th'))

    const filteredData = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td')) as HTMLTableElement[];
      return columnsToInclude.map(col => {
        const cellIndex = headers.findIndex(header => header.innerText.trim() === col);
        if (cellIndex !== -1 && cells[cellIndex]) {
          return cells[cellIndex].innerText || '';
        }
        return '';
      })
    })

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }
}
