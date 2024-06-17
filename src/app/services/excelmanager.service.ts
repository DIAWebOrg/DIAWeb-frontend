import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelData, DataToSubmit } from './models';

@Injectable({
  providedIn: 'root',
})
export class ExcelManagerService {

  readExcel(file: File): Promise<{ excelData: ExcelData }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const data = event.target?.result;
        if (typeof data === 'string' || data instanceof ArrayBuffer) {
          const workBook = XLSX.read(data, { type: 'binary' });
          const jsonData = this.processWorkbook(workBook);
          resolve({ excelData: jsonData });
        } else {
          reject('Failed to read file');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  processWorkbook(workBook: XLSX.WorkBook): ExcelData {
    const excelData: ExcelData = { excelData: {} };
    workBook.SheetNames.forEach((name) => {
      // one excel workbook has multiple sheets, for each one get the name and the data
      const sheet = workBook.Sheets[name];
      excelData.excelData[name] = XLSX.utils.sheet_to_json(sheet);
    });
    return excelData;
  }

  transformData(jsonData: ExcelData): DataToSubmit {
    const dataToSubmit = jsonData.excelData[Object.keys(jsonData.excelData)[0]][0];
    const { CP_numero, CP_codigo, meses, incidencia, CP, ...attributes } = dataToSubmit;
    return { data: Object.values(attributes) };
  }
}