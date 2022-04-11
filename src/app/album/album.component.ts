import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: any;
  private sub: Subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private mds: MusicDataService
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];

    this.sub = this.mds
      .getAlbumById(id)
      .subscribe((data) => (this.album = data));
  }

  addToFavourites(trackID: any) {
    this.mds.addToFavourites(trackID).subscribe(
      (success) => {
        if (success)
          this.snackBar.open('Adding to Favourites...', 'Done', {
            duration: 1500,
          });
      },
      (err) => {
        this.snackBar.open('Unable to add song to Favourites', 'Done', {
          duration: 1500,
        });
      }
    );

    if (this.mds.addToFavourites(trackID))
      this.snackBar.open('Adding to Favourites...', 'Done', { duration: 1500 });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
