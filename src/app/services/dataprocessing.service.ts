import { Injectable, EventEmitter } from '@angular/core';
import { ExcelManagerService } from './excelmanager.service';
import { FileValidatorService } from './filevalidator.service'; 
import { ExcelData } from './models';

@Injectable({
    providedIn: 'root',
})
export class DataProcessingService {
    dataProcessed = new EventEmitter<any>();

    constructor(
        private excelManagerService: ExcelManagerService,
        private fileValidatorService: FileValidatorService 
    ) { }

    onFileChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!target.files?.length) return;

        const file = target.files[0];
        if (this.fileValidatorService.isValidFile(file)) { 
            this.excelManagerService.readExcel(file)
                .then((value: { excelData: ExcelData }) => {
                    const transformedData = this.excelManagerService.transformData(value.excelData);
                    console.log(transformedData);
                    const dataToEmit = { // both values are passed to the main component
                        transformedData: transformedData,
                        selectedFileName: file.name
                    };
                    console.log(dataToEmit);
                    this.dataProcessed.emit(dataToEmit)
                })
                .catch(error => console.error(error));
        } else {
            console.error('Invalid file type or size.');
        }
    }
}