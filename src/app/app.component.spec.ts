import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  it('should call HttpClient.post on submitNumbers', () => {
    httpClientSpy.post.and.returnValue(of({}));
    component.submitNumbers();
    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  it('should update apiResponse after HttpClient.post', () => {
    const expectedResponse = { data: '123' };
    httpClientSpy.post.and.returnValue(of(expectedResponse));

    component.submitNumbers();
    expect(component.apiResponse).withContext('apiResponse should be updated').toEqual(expectedResponse);
  });
});