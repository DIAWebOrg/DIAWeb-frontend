export interface ExcelData {
  // The key is the sheet name and the value is an array of pairs where the key is the column name and the value is the cell value.
  excelData: { [sheetName: string]: Array<{ [key: string]: number }> };
}

export interface DataToSubmit {
  // this is what the API expects
  data?: number[] | null; 
  action: string | null;
  api_key: string | null;
}

export interface APIResponse {
  prediction: number [][];
  remaining_requests: number;
}

export interface DataProcessedEvent { // data to emit from the DataProcessingService to the component
  transformedData: number[];
  selectedFileName: string;
}