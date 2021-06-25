import { TestBed } from '@angular/core/testing';

import { SeoServceService } from './seo-servce.service';

describe('SeoServceService', () => {
  let service: SeoServceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoServceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
