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

  input1: number | null = null;
  input2: number | null = null;
  input3: number | null = null;
  input4: number | null = null;
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

    /*const observable: Observable<any> = this.http.post<any>('http://127.0.0.1:8000/api/predict_digits', { data });

    observable.subscribe({
      next: (response: any) => {
        console.log('POST request sent successfully', response);
        this.apiResponse = response;
      },
      error: (error: any) => {
        console.error('Error sending POST request', error);
      }
    });*/
  }
}