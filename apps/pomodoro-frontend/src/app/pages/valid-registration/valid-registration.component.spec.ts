import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidRegistrationComponent } from './valid-registration.component';

describe('ValidRegistrationComponent', () => {
  let component: ValidRegistrationComponent;
  let fixture: ComponentFixture<ValidRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidRegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
