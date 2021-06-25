import { Component } from '@angular/core';
import {filter, map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {SeoService} from './Services/seo-servce.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private seoService: SeoService) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
      .subscribe((event) => {
        if (this.router.url.endsWith('hex')){
          event.title = event.title.replace('%boardtype%', 'Hex Grid');
        }
        if (this.router.url.endsWith('square')){
          event.title = event.title.replace('%boardtype%', 'Square Grid');
        }
        event.ogUrl = this.router.url;
        this.seoService.update(event.title, event.description, event.ogUrl, event.keywords);
      });
  }
}
