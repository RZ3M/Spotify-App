/*********************************************************************************
 * WEB422 – Assignment 6
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jack Ma    Student ID: 150150209    Date: 04/10/2022
 *
 * Angular App (Deployed) Link: https://spotify-app-bay.vercel.app
 *
 * User API (Heroku) Link: https://jm-spotify-user-api.herokuapp.com/api/
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
  title = 'web422-a6';
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
