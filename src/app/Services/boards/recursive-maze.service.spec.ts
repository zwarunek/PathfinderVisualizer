import { TestBed } from '@angular/core/testing';

import { RecursiveMazeService } from './recursive-maze.service';

describe('RecursiveMazeService', () => {
  let service: RecursiveMazeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecursiveMazeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
