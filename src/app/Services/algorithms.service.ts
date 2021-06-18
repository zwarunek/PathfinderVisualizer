import { Injectable } from '@angular/core';
import {DijkstraService} from './algorithms/dijkstra.service';
import {Globals} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class AlgorithmsService {

  constructor(private globals: Globals, private dijkstra: DijkstraService) { }

  runPathfindingAlgorithm(algorithm: any,
                          graph: number[][],
                          src: number,
                          target: number,
                          numTiles: number): any {
    switch (algorithm){
      case 'dijkstra':
        return this.dijkstra.pathFind(this, graph, src, target, numTiles);
    }
  }
}
