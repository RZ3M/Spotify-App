import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  results: any;
  searchQuery: string = '';
  private sub: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private mds: MusicDataService) {}

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'];
      this.mds.searchArtists(this.searchQuery).subscribe((data) => {
        this.results = data.artists.items.filter(
          (artist) => artist.images.length > 0
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
