import { TestBed } from '@angular/core/testing';

import { GraphUtilsService } from './graph-utils.service';

describe('GraphUtilsService', () => {
  let service: GraphUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
