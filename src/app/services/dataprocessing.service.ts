import { Injectable } from '@angular/core';
import { Observable, of, throwError, from, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ExcelManagerService } from './excelmanager.service';
import { FileValidatorService } from './filevalidator.service';
import { DataToSubmit, ExcelData, DataProcessedEvent } from './models';

@Injectable({
    providedIn: 'root',
})
export class DataProcessingService {
    dataProcessed = new Subject<DataProcessedEvent>();

    constructor(
        private excelManagerService: ExcelManagerService,
        private fileValidatorService: FileValidatorService
    ) { }

    onFileChange(event: Event): Observable<DataProcessedEvent> {

        const target : HTMLInputElement = event.target as HTMLInputElement;
        if (!target.files?.length) {
            return throwError(() => new Error('No file selected.'));
        }

        const file : File = target.files[0];
        const isValid : boolean = this.fileValidatorService.isValidFile(file).isValid;

        if (!isValid) {
            return throwError(() => new Error('Invalid file type or size.'));
        }

        return from(this.excelManagerService.readExcel(file)).pipe(
            map((value: { excelData: ExcelData }) => {
                const transformedData : number[] = this.excelManagerService.transformData(value.excelData);
                const result : DataProcessedEvent = {
                    transformedData: transformedData,
                    selectedFileName: file.name
                };
                this.dataProcessed.next(result);
                return result; // apart from emitting the data, return it as well because the caller from the component needs it to do .subscribe() on it
            }),
            catchError(error => {
                return of(error);
            })
        );
    }
}