import { Injectable } from '@angular/core';
import {DijkstraService} from './algorithms/dijkstra.service';
import {Globals} from '../globals';
import {AStarService} from './algorithms/a-star.service';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  constructor(private globals: Globals, private dijkstra: DijkstraService, private aStar: AStarService) { }

  runPathfindingAlgorithm(algorithm: any,
                          graph: number[][],
                          src: {row, col},
                          target: {row, col},
                          rows: number,
                          cols: number,
                          diagonal: boolean): any {
    switch (algorithm){
      case 'dijkstra':
        return this.dijkstra.pathFind(graph, src.row * cols + src.col, target.row * cols + target.col, rows * cols);
      case 'A*':
        return this.aStar.pathFind(graph, [src.row, src.col], [target.row, target.col], rows, cols, diagonal);
    }
  }
}
