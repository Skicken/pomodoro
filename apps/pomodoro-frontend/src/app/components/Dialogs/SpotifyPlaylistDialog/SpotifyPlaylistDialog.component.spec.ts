import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotifyPlaylistDialogComponent } from './SpotifyPlaylistDialog.component';

describe('SpotifyPlaylistDialogComponent', () => {
  let component: SpotifyPlaylistDialogComponent;
  let fixture: ComponentFixture<SpotifyPlaylistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpotifyPlaylistDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpotifyPlaylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
