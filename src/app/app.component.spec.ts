import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { MusicDataService } from './music-data.service';

const token = `${btoa('{}')}.${btoa(JSON.stringify({ userName: 'listener' }))}.signature`;
const artist = { id: 'artist-1', name: 'Test Artist', type: 'artist', followers: { total: 100 }, images: [{ url: '/artist.png' }] };
const album = {
  id: 'album-1', name: 'Test Album', images: [{ url: '/cover.png' }, { url: '/cover-small.png' }],
  artists: [artist], label: 'Test Label', release_date: '2026-01-01', total_tracks: 1,
  popularity: 50, copyrights: [], tracks: { items: [] as unknown[] },
};
const track = {
  id: 'track-1', name: 'Test Track', track_number: 1, duration_ms: 180000,
  artists: [artist], album, preview_url: '/preview.mp3', popularity: 50,
};
album.tracks.items = [track];

describe('Angular upgrade regression checks', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MusicDataService, useValue: {
          getNewReleases: () => of({ albums: { items: [album] } }),
          getAlbumById: () => of(album),
          getArtistById: () => of(artist),
          getTopTracksByArtistId: () => of({ tracks: [track] }),
          getAlbumsByArtistId: () => of({ items: [album] }),
          searchArtists: () => of({ artists: { items: [artist] } }),
          getFavourites: () => of({ tracks: [track] }),
        } },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    fixture.destroy();
    localStorage.clear();
  });

  async function navigate(url: string) {
    await router.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('redirects unauthenticated visitors to a working login form', async () => {
    await navigate('/newReleases');
    expect(router.url).toBe('/login');
    expect(fixture.nativeElement.querySelector('input[name="username"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('submits credentials, stores the JWT, and renders new releases after login', async () => {
    await navigate('/login');
    for (const [name, value] of [['username', 'listener'], ['password', 'password']]) {
      const input = fixture.nativeElement.querySelector(`input[name="${name}"]`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.detectChanges();
    fixture.nativeElement.querySelector('app-login form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const request = http.expectOne(req => req.url.endsWith('/login'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({ userName: 'listener', password: 'password' });
    request.flush({ token });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(localStorage.getItem('access_token')).toBe(token);
    expect(router.url).toBe('/newReleases');
    expect(fixture.nativeElement.textContent).toContain('Test Album');
  });

  it.each([
    ['/newReleases', 'Test Album'],
    ['/album/album-1', 'Test Track'],
    ['/artist/artist-1', 'Test Artist'],
    ['/search?q=test', 'Test Artist'],
    ['/favourites', 'Test Track'],
    ['/about', 'About'],
    ['/register', 'Register'],
  ])('renders %s with the upgraded Material components', async (url, text) => {
    localStorage.setItem('access_token', token);
    await navigate(url);
    expect(fixture.nativeElement.textContent).toContain(text);
  });

  it('keeps the DI HTTP interceptor and preserves Spotify authorization', () => {
    localStorage.setItem('access_token', token);
    const client = TestBed.inject(HttpClient);
    client.get('/favourites').subscribe();
    const userRequest = http.expectOne('/favourites');
    expect(userRequest.request.headers.get('Authorization')).toBe(`JWT ${token}`);
    userRequest.flush([]);
    client.get('https://api.spotify.com/v1/albums/album-1', {
      headers: { Authorization: 'Bearer spotify-token' },
    }).subscribe();
    const spotifyRequest = http.expectOne('https://api.spotify.com/v1/albums/album-1');
    expect(spotifyRequest.request.headers.get('Authorization')).toBe('Bearer spotify-token');
    spotifyRequest.flush({});
  });
});
