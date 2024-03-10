import { SpotifyAuthGuard } from './spotify-auth.guard';

describe('SpotifyAuthGuard', () => {
  it('should be defined', () => {
    expect(new SpotifyAuthGuard()).toBeDefined();
  });
});
