import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectTemplateDialogComponent } from './select-template-dialog.component';

describe('SelectTemplateDialogComponent', () => {
  let component: SelectTemplateDialogComponent;
  let fixture: ComponentFixture<SelectTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
