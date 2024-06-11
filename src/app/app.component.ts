import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {

  input1: number = 0;
  input2: number = 0;
  input3: number = 0;
  input4: number = 0;
  apiResponse: any;

  constructor(private renderer: Renderer2, private el: ElementRef, private http: HttpClient) { }

  ngOnInit() {
    this.loadScript('/home/user/diaweb-frontend/public/animation.js');
  }

  private loadScript(scriptUrl: string) {
    const script = this.renderer.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(this.el.nativeElement, script);
  }

  submitNumbers() {
    /*
    const data = {
      number1: this.input1,
      number2: this.input2,
      number3: this.input3,
      number4: this.input4
    };
    */

    // TODO: Remove this when the real API is ready
    const data: number[][] = [];
    for (let i = 0; i < 28; i++) {
      data.push([]);
      for (let j = 0; j < 28; j++) {
        data[i].push(0);
      }
    }

    const observable: Observable<any> = this.http.post<any>('https://8000-idx-diaweb-backend-1718093896779.cluster-6yqpn75caneccvva7hjo4uejgk.cloudworkstations.dev/hello', data);

    observable.subscribe({
      next: (response: any) => {
        console.log('POST request sent successfully', response);
        this.apiResponse = response;
      },
      error: (error: any) => {
        console.error('Error sending POST request', error);
      }
    });
  }
}