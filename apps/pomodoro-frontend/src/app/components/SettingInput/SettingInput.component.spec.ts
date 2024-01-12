import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputMinutesComponent } from './SettingInput.component';

describe('InputMinutesComponent', () => {
  let component: InputMinutesComponent;
  let fixture: ComponentFixture<InputMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputMinutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
