/*********************************************************************************
 *
 * Angular App (Deployed) Link: https://spotify-app-bay.vercel.app
 *
 * User API Link: https://spoti-api.onrender.com
 *
 ********************************************************************************/

import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'spoticlone';
  searchString: string = '';
  token: any;

  constructor(private router: Router, private auth: AuthService) {}

  handleSearch(): void {
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchString },
    });
    this.searchString = '';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) this.token = this.auth.readToken();
    });
  }
}
