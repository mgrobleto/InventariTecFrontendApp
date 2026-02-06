import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor() { }

  private async addLogoToWorksheet(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet): Promise<number> {
    const logoUrl = 'assets/tecnorefill-logo.png';
    const logoRows = 3;

    try {
      const response = await fetch(logoUrl);
      if (!response.ok) {
        return 0;
      }
      const buffer = await response.arrayBuffer();
      const base64 = this.arrayBufferToBase64(buffer);

      worksheet.insertRows(1, Array.from({ length: logoRows }, () => []));
      const imageId = workbook.addImage({ base64, extension: 'png' });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 220, height: 80 }
      });

      return logoRows;
    } catch {
      return 0;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  }

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

    await this.addLogoToWorksheet(workbook, worksheet);

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

    const logoRows = await this.addLogoToWorksheet(workbook, worksheet);
    const headerRowIndex = 1 + logoRows;
    worksheet.getRow(headerRowIndex).font = { bold: true };
    worksheet.getRow(headerRowIndex).alignment = { vertical: 'middle', horizontal: 'center' };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}
