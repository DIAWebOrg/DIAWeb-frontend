import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from './services/api.service';
import { DataProcessingService } from './services/dataprocessing.service';
import { DataToSubmit } from './services/models';
import { ScriptLoaderService } from './services/scriptloader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
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
    const element = event.target as HTMLInputElement;
    this.dataProcessingService.onFileChange(event).subscribe({
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
      next: (data) => {
        this.apiResponse = data;
        this.remainingAPIRequests = (this.remainingAPIRequests as number) - 1;
        this.selectedFileName = null;
      },
      error: (e) => this.snackBar.open(e, '', {
        duration: 5000,
        panelClass: ['custom-snack-bar'],
      })
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
        error: (e) => this.snackBar.open(e, '', {
          duration: 5000,
          panelClass: ['custom-snack-bar']
        })
      });
    }
  }
}