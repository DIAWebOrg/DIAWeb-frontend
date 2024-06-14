import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: any[];
}

interface DataToSubmit {
  data: number[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {

  title: string = 'DIAWeb';
  selectedFileName: string = 'Select a file to upload';
  dataToSubmit: DataToSubmit = { data: [] }; // initialized empty dataToSubmit object (it will then be overwritten by the data from the Excel file)
  apiResponse: any;

  constructor(private renderer: Renderer2, private el: ElementRef, private http: HttpClient) { }

  ngOnInit() {
    this.loadScript('animation.js'); // No need to specify the full path cuz Angular will look in the public folder
  }

  private loadScript(scriptUrl: string) {
    const script = this.renderer.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(this.el.nativeElement, script);
  }

  triggerFileUpload() {
    // Trigger the click event on the hidden file input
    const fileToUpload = document.getElementById('fileUpload');
    fileToUpload?.click(); // if fileUpload is not null, then click on it
  }

  isValidFile(file: File): boolean {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type) || file.size > maxSize) {
      console.error('Invalid file type or size.');
      return false;
    }
    return true;
  }

  onFileChange(ev: Event) {
    const target = ev.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.apiResponse = null;
      this.selectedFileName = file.name;
      if (this.isValidFile(file)) {
        let workBook: XLSX.WorkBook; // initialize empy workBook
        let jsonData: ExcelData = {}; // initialize empty jsonData object
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => { // event listener for when the file is loaded
          const data = event.target?.result;
          if (typeof data === 'string' || data instanceof ArrayBuffer) {
            workBook = XLSX.read(data, { type: 'binary' }); // excel object
            jsonData = workBook.SheetNames.reduce((initial: ExcelData, name) => { // extract the data from the Excel file
              const sheet = workBook.Sheets[name];
              initial[name] = XLSX.utils.sheet_to_json(sheet);
              return initial;
            }, {});
            this.dataToSubmit = this.transformData(jsonData); // transform the data to the format that the backend expects
          }
        };
        reader.readAsArrayBuffer(file); // actually called before the event listener
      }
    }
    target.value = '';
  }

  transformData(jsonData: ExcelData): DataToSubmit { // receives the ExcelData object and returns a DataToSubmit object
    const dataToSubmit = jsonData[Object.keys(jsonData)[0]][0];
    const { CP_numero, CP_codigo, meses, incidencia, CP, ...attributes } = dataToSubmit;
    return { data: Object.values(attributes) }; // because attributes is already an object
  }

  submitProfile() {
    const observable: Observable<any> = this.http.post<any>('http://127.0.0.1:8000/predict_diabetes', this.dataToSubmit);

    observable.subscribe({
      next: (response: any) => {
        console.log('POST request sent successfully', response);
        if (response.prediction) {
          this.apiResponse = parseFloat(response.prediction[0][0].toFixed(2));
        } else {
          console.error('Invalid response structure', response);
        }  
      },
      error: (error: any) => {
        console.error('Error sending POST request', error);
      }
    });
  }
}