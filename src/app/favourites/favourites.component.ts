import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit {
  favourites: Array<any> = [];
  private sub: Subscription = new Subscription();
  constructor(private mds: MusicDataService) {}

  removeFromFavourites(id: any) {
    this.sub = this.mds
      .removeFromFavourites(id)
      .subscribe((data) => (this.favourites = data.tracks));
  }

  ngOnInit(): void {
    this.sub = this.mds
      .getFavourites()
      .subscribe((data) => (this.favourites = data.tracks));
  }

  ngOnDestry(): void {
    this.sub.unsubscribe();
  }
}
