export interface ExcelData {
  // The key is the sheet name and the value is an array of pairs where the key is the column name and the value is the cell value.
  excelData: { [sheetName: string]: Array<{ [key: string]: number }> };
}

export interface DataToSubmit {
  // this is what the API expects
  data: number[] | null;
}