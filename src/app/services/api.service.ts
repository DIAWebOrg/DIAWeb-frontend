import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataToSubmit } from './models';

interface ApiResponse {
  prediction: number[][];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  onDataReceived: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  submitProfile(dataToSubmit: DataToSubmit | null): Observable<number> {
    const apiKey = localStorage.getItem('X-API-KEY');
    if (!apiKey) {
      return throwError(() => new Error('License is missing'));
    }

    if (!dataToSubmit?.data) {
      return throwError(() => new Error('Data is missing'));
    }

    const headers = new HttpHeaders().set('X-API-KEY', apiKey);

    return this.http.post<ApiResponse>('http://127.0.0.1:8000/predict_diabetes', dataToSubmit, { headers })
      .pipe(
        map(response => {
          if (response.prediction) {
            return parseFloat(response.prediction[0][0].toFixed(2));
          }
          throw new Error('Invalid response structure');
        }),
        catchError((error) => { // backend error handling (they are not supposed to be thrown ever)
          let errorMessage = 'An unexpected error occurred';
          switch (error.status) {
            case 401:
              errorMessage = 'API key required';
              break;
            case 400:
              errorMessage = 'Invalid API key format';
              break;
            case 404:
              errorMessage = 'API key not found';
              break;
            case 429:
              errorMessage = 'Rate limit exceeded';
              break;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getRemainingAPIRequests(apiKey: string): Observable<any> {
    const body = { api_key: apiKey };
    return this.http.post<any>('http://127.0.0.1:8000/remaining_requests', body).pipe(
      map(response => {
        return response.remaining_requests 
      })
    );

  }
}