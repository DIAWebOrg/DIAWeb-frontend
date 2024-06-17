import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataToSubmit } from './models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  onDataReceived = new EventEmitter<number>();
  constructor(private http: HttpClient) {}

  submitProfile(dataToSubmit: DataToSubmit | null) {
    const apiKey = localStorage.getItem('X-API-KEY');
  
    if (apiKey) {
      const headers = new HttpHeaders().set('X-API-KEY', apiKey);
      const options = { headers: headers };
  
      const observable: Observable<any> = this.http.post<any>('http://127.0.0.1:8000/predict_diabetes', dataToSubmit, options);
  
      observable.subscribe({
        next: (response: any) => {
          console.log('POST request sent successfully', response);
          if (response.prediction) {
            const apiResponse = parseFloat(response.prediction[0][0].toFixed(2));
            this.onDataReceived.emit(apiResponse); // update apiResponse state
          } else {
            console.error('Invalid response structure', response);
          }
        },
        error: (error: any) => {
          console.error('Error sending POST request', error);
        }
      });
    } else {
      alert('No license detected. Please redeem a license code');
    }
  }
}