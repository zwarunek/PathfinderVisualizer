import {Injectable} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SeoService {
  constructor(private title: Title, private meta: Meta) { }

  update(title: string, desc: string, url: string, keywords: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: title + ' - ' + desc });
    this.meta.updateTag({ name: 'og:url', content: url });
    this.meta.updateTag({ name: 'keywords', content: keywords });

  }
}
