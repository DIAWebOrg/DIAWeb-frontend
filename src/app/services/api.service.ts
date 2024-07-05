import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { DataToSubmit, APIResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  socket = new WebSocket('ws://127.0.0.1:8000/ws/predict_diabetes/');

  private onDataReceivedSubject = new Subject<APIResponse>();
  onDataReceived = this.onDataReceivedSubject.asObservable();

  submitProfile(dataToSubmit: DataToSubmit | null): Observable<APIResponse> {
    // sender method
    this.socket.send(JSON.stringify(dataToSubmit));
    // i need to return this because the caller from the components wants to do .subscribe() on it
    return new Observable<APIResponse>((subscriber) => {
      // receiver method
      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.error) {
          subscriber.error(response.error);
        }

        else {
          subscriber.next(response);
        }
      };
    })
  }

  getRemainingRequests(apiKey: string): Observable<number> {
    // called on init and with each api key submit
    // sender method
    const dataToSubmit: DataToSubmit = { action: 'check_remaining_requests', api_key: apiKey };

    this.socket.send(JSON.stringify(dataToSubmit));

    return new Observable<number>((subscriber) => {
      // receiver method
      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        // handle error messages:
        if (response.error) {
          subscriber.error(response.error);
        }

        else {
          const remainingRequests = response.remaining_requests;
          subscriber.next(remainingRequests);
        }
      }
    })
  }
}