import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { APIResponse } from './services/models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockSocket: any;
  let onDataReceivedSubject: Subject<APIResponse>;

  beforeEach(async () => {
    onDataReceivedSubject = new Subject<APIResponse>();
    mockSocket = {
      emit: jasmine.createSpy('emit'),
      fromEvent: jasmine.createSpy('fromEvent').and.returnValue(onDataReceivedSubject.asObservable()),
      on: jasmine.createSpy('on')
    };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AppComponent], 
      providers: [{ provide: Socket, useValue: mockSocket }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'DIAWeb' title`, () => {
    expect(component.title).toEqual('DIAWeb');
  });

  it('should emit data to the server on submitProfile', () => {
    const testData = { data: [1, 2, 3] };
    component.dataToSubmit = testData;
    component.submitProfile();
    expect(mockSocket.emit).toHaveBeenCalledWith('predict_diabetes', testData);
  });

  it('should handle prediction response from the server', fakeAsync(() => {
    const expectedResponse = { prediction: 1.23, remaining_requests: 10 }; 
    component.submitProfile();
  
    // Simulate receiving a prediction from the server
    onDataReceivedSubject.next(expectedResponse);
    
    expect(component.apiResponse).toEqual(expectedResponse.prediction);
  }));
});