import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAlarmDialogComponent } from './add-alarm-dialog.component';

describe('AddAlarmDialogComponent', () => {
  let component: AddAlarmDialogComponent;
  let fixture: ComponentFixture<AddAlarmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAlarmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAlarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
