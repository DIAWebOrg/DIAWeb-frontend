import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataToSubmit } from './models';
import { supabase } from './supabase.service';

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
      return throwError(() => new Error('API key is missing'));
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

  getRemainingAPIRequests(apiKey: string): Observable<number> {

    return new Observable((subscriber) => {
      supabase
        .from('myapp_apikey')
        .select('remaining_requests')
        .eq('api_key', `${apiKey}`)
        .then((response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            const remainingAPIRequests = parseInt(response.data[0].remaining_requests, 10);
            subscriber.next(remainingAPIRequests);
            subscriber.complete();
          } else {
            subscriber.error(new Error('API key not found')); // not existing in supabase database
          }
        });
    });
  }
}