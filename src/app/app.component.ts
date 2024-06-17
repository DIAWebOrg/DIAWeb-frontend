import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { ApiService } from './services/api.service';
import { DataProcessingService } from './services/dataprocessing.service';
import { DataToSubmit } from './services/models';
import { ScriptLoaderService } from './services/scriptloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {

  title: string = 'DIAWeb';
  selectedFileName: string | null = null;
  dataToSubmit: DataToSubmit = {
    data: null
  };
  apiResponse: number | null = null;

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private apiService: ApiService,
    private dataProcessingService: DataProcessingService,
  ) { }

  ngOnInit() {
    this.scriptLoaderService.loadScript('animation.js'); // No need to specify the full path cuz Angular will look in the public folder

    this.dataProcessingService.dataProcessed.subscribe(data => {
      this.selectedFileName = data.selectedFileName;
      this.dataToSubmit = data.transformedData;
    });

    this.apiService.onDataReceived.subscribe((data: number) => {
      this.apiResponse = data;
    });
  }

  onFileChange(event: Event) {
    this.dataProcessingService.onFileChange(event);
  }

  triggerFileUpload(): void {
    document.getElementById('fileUpload')?.click();
  }

  submitProfile() {
    this.apiService.submitProfile(this.dataToSubmit);
  }

  submitApiKey() {
    const apiKey = (document.getElementById('license-input') as HTMLInputElement).value; // get the value of the input field
    localStorage.setItem('X-API-KEY', apiKey);
  }
}