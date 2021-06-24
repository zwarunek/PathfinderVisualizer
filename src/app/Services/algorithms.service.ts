import { Injectable } from '@angular/core';
import {DijkstraService} from './algorithms/dijkstra.service';
import {Globals} from '../globals';
import {AStarService} from './algorithms/a-star.service';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  constructor(private globals: Globals, private dijkstra: DijkstraService, private aStar: AStarService) { }

  runPathfindingAlgorithm(algorithm: string,
                          graph: number[][],
                          src: {row, col},
                          target: {row, col},
                          rows: number,
                          cols: number,
                          heuristic: string,
                          diagonal: boolean,
                          boardType: string): any {
    switch (algorithm){
      case 'Dijkstra\'s Algorithm':
        return this.dijkstra.pathFind(graph, src.row * cols + src.col, target.row * cols + target.col, rows * cols);
      case 'A* Algorithm':
        return this.aStar.pathFind(graph, [src.row, src.col], [target.row, target.col], rows, cols, heuristic, diagonal, boardType);
    }
  }
}
