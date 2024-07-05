import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelData, DataToSubmit, DataToSubmitUnprocessed } from './models';

@Injectable({
  providedIn: 'root',
})
export class ExcelManagerService {

  async readExcel(file: File): Promise<{ excelData: ExcelData }> {
    try {
      const data : ArrayBuffer = await this.readFileAsArrayBuffer(file);
      const workBook : XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const jsonData : ExcelData = this.processWorkbook(workBook);
      return { excelData: jsonData };
    } catch (error) {
      throw new Error(`Failed to read file: ${error}`);
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader : FileReader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const data : string | ArrayBuffer | null | undefined = event.target?.result;
        data instanceof ArrayBuffer ? resolve(data) : reject('File data is not an ArrayBuffer');
      };
      reader.onerror = (event) => reject(event.target?.error);
      reader.readAsArrayBuffer(file);
    });
  }

  processWorkbook(workBook: XLSX.WorkBook): ExcelData {
    const excelData: ExcelData = { excelData: {} };
    workBook.SheetNames.forEach((name) => {
      // one excel workbook has multiple sheets, for each one get the name and the data
      const sheet : XLSX.WorkSheet = workBook.Sheets[name];
      excelData.excelData[name] = XLSX.utils.sheet_to_json(sheet);
    });
    return excelData;
  }

  transformData(jsonData: ExcelData): number[] {
    const dataToSubmit : DataToSubmitUnprocessed = jsonData.excelData[Object.keys(jsonData.excelData)[0]][0];
    const { CP_numero, CP_codigo, meses, incidencia, CP, ...attributes } : DataToSubmitUnprocessed = dataToSubmit;
    return Object.values(attributes).map((value) => Number(value));
  }
}