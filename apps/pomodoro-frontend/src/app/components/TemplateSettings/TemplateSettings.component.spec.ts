import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateSettingsComponent } from './TemplateSettings.component';

describe('TemplateSettingsComponent', () => {
  let component: TemplateSettingsComponent;
  let fixture: ComponentFixture<TemplateSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
