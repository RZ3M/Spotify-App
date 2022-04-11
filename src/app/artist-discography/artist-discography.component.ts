import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css'],
})
export class ArtistDiscographyComponent implements OnInit, OnDestroy {
  albums: any;
  tracks: any;
  artist: any;

  private sub: any;

  constructor(private route: ActivatedRoute, private mds: MusicDataService) {}

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];

    this.sub = this.mds.getArtistById(id).subscribe((data) => {
      this.artist = data;
    });

    this.sub = this.mds.getTopTracksByArtistId(id, 'CA').subscribe((data) => {
      this.tracks = data.tracks;
    });

    this.sub = this.mds.getAlbumsByArtistId(id).subscribe((data) => {
      this.albums = data.items.filter(
        (curValue, index, self) =>
          self.findIndex(
            (t) => t.name.toUpperCase() === curValue.name.toUpperCase()
          ) === index
      );
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
