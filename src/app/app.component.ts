import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './services/api.service';
import { DataProcessingService } from './services/dataprocessing.service';
import { DataToSubmit } from './services/models';
import { ScriptLoaderService } from './services/scriptloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent implements OnInit {

  title: string = 'DIAWeb';
  selectedFileName: string | null = null;
  dataToSubmit: DataToSubmit | null = null;
  prediction: number | null = null;
  apiKey: string | null = null;
  remainingRequests: number | string = '';

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private apiService: ApiService,
    private dataProcessingService: DataProcessingService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.apiKey = localStorage.getItem('X-API-KEY');

    if (this.apiKey) {
      this.apiService.socket.addEventListener('open', () => this.apiKey && this.getRemainingRequests(this.apiKey))
    }

    this.scriptLoaderService.loadScript('animation.js');
  }

  onFileChange(event: Event) {
    const element : HTMLInputElement = event.target as HTMLInputElement;
    this.dataProcessingService.onFileChange(event).subscribe({
      next: (dataProcessedEvent) => {

        this.dataToSubmit = {
          data: dataProcessedEvent.transformedData,
          action: 'predict_diabetes',
          api_key: this.apiKey, // put the api key in the data to submit because the one that comes from dataProcessedEvent is null
        };
        this.selectedFileName = dataProcessedEvent.selectedFileName;
      },
      error: (e) => this.snackBar.open(e, '', {
        duration: 5000,
        panelClass: ['custom-snack-bar']
      })
    });
    if (element) {
      element.value = '';
    }
  }

  triggerFileUpload(): void {
    document.getElementById('fileUpload')?.click();
  }

  submitProfile() { // profile as in "biochemical profile"
    this.apiService.submitProfile(this.dataToSubmit).subscribe({
      next: (apiResponse) => {
        this.prediction = parseFloat(apiResponse.prediction ? apiResponse.prediction[0][0].toFixed(2) : '');
        this.remainingRequests = apiResponse.remaining_requests;
        this.selectedFileName = null;
      },
      error: (e) => this.snackBar.open(e, '', {
        duration: 5000,
        panelClass: ['custom-snack-bar'],
      })
    });
  }

  submitApiKey(license: string, inputElement: HTMLInputElement) {
    this.getRemainingRequests(license); // Update the remaining API calls immediately
    inputElement.value = ''; // Clear the input box
  }

  getRemainingRequests(license: string) {
    // this is called on init and on each api key submission
    this.apiService.getRemainingRequests(license).subscribe({
      next: (data) => {
        localStorage.setItem('X-API-KEY', license);
        this.apiKey = license; // Update the apiKey property with the new value
        this.remainingRequests = data;
      },
      error: (e) => this.snackBar.open(e, '', {
        duration: 5000,
        panelClass: ['custom-snack-bar']
      })
    });

  }
}