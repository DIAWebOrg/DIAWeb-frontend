import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class AppComponent implements OnInit, OnDestroy {

  title: string = 'DIAWeb';
  selectedFileName: string | null = null;
  dataToSubmit: DataToSubmit = {
    data: null
  };
  apiResponse: number | null = null;
  apiKey: string | null = null;
  remainingAPIRequests: number | string = '';

  private subscriptions = new Subscription();

  constructor(
    private scriptLoaderService: ScriptLoaderService,
    private apiService: ApiService,
    private dataProcessingService: DataProcessingService,
  ) { }

  ngOnInit() {
    this.apiKey = localStorage.getItem('X-API-KEY')
    if (this.apiKey) {
      this.getRemainingAPIRequests(this.apiKey);
    }
    
    this.scriptLoaderService.loadScript('animation.js');

    this.subscriptions.add(this.dataProcessingService.dataProcessed.subscribe(data => {
      this.selectedFileName = data.selectedFileName;
      this.dataToSubmit = data.transformedData;
    }));

    this.subscriptions.add(this.apiService.onDataReceived.subscribe((data: number) => {
      this.apiResponse = data;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onFileChange(event: Event) {
    this.dataProcessingService.onFileChange(event).subscribe({
      error: (e) => alert(e)
    });

  }

  triggerFileUpload(): void {
    document.getElementById('fileUpload')?.click();
  }

  submitProfile() { // profile as in "biochemical profile"
    this.apiService.submitProfile(this.dataToSubmit).subscribe({
      next: (data) => {
        this.apiResponse = data;
        this.remainingAPIRequests = (this.remainingAPIRequests as number) - 1;
      },
      error: (e) => alert(e)
    });
  }

  submitApiKey(license: string, inputElement: HTMLInputElement) {
    this.getRemainingAPIRequests(license); // Update the remaining API calls immediately
    inputElement.value = ''; // Clear the input box
  }

  getRemainingAPIRequests(license: string) {
    if (license) {
      this.apiService.getRemainingAPIRequests(license).subscribe({
        next: (data) => {
          localStorage.setItem('X-API-KEY', license);
          this.apiKey = license; // Update the apiKey property with the new value
          this.remainingAPIRequests = data;
        },
        error: (error) => {
          alert(error);
        }
      });
    }
  }
}