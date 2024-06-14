import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpClientSpy: { post: jasmine.Spy };

  beforeEach(async () => {
    // Create an instance of the component
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    await TestBed.configureTestingModule({
      // Provide both the component and the mock HttpClient
      imports: [AppComponent],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  // frontend tests
  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'DIAWeb' title`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DIAWeb');
  });

  // backend tests
  it('should call HttpClient.post on submitProfile', () => {
    httpClientSpy.post.and.returnValue(of({}));
    component.submitProfile();
    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  it('should update apiResponse after HttpClient.post', fakeAsync(() => {
    const expectedResponse = 1.23; // Directly use the expected number
    httpClientSpy.post.and.returnValue(of({ prediction: [[{ toFixed: () => 1.23 }]] }));
    component.submitProfile();
    tick(); // Wait for all asynchronous operations to complete
    console.log('apiResponse after submitProfile:', component.apiResponse);
    expect(component.apiResponse).withContext('apiResponse should be updated').toEqual(expectedResponse);
    flush(); // Ensure no more tasks are left
  }));
});