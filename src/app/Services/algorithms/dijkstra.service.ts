import { Injectable } from '@angular/core';
import {AlgorithmsService} from '../algorithms.service';
import {HomeComponent} from '../../home/home.component';
import {Globals} from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class DijkstraService {

  constructor(private globals: Globals) { }

  pathFind(parent: AlgorithmsService,
           graph: number[][],
           src: number,
           target: number,
           numTiles: number): {path, steps} {
    const dist = new Array(numTiles);
    const sptSet = new Array(numTiles);
    const p = new Array(numTiles);
    const display = [];

    // console.log('inside dijkstra');
    for (let i = 0; i < numTiles; i++) {
      p[src] = -1;
      dist[i] = Number.MAX_VALUE;
      sptSet[i] = false;
    }

    dist[src] = 1;

    for (let i = 0; i < numTiles - 1; i++) {
      if (!this.globals.inProgress) {
        return undefined;
      }

      const u = this.minDistance(dist, sptSet, numTiles);
      if (u === -1) {
        this.globals.finished = true;
        this.globals.inProgress = false;
        this.globals.noPath = true;
        return undefined;
      }
      sptSet[u] = true;
      display.push(u);
      for (let v = 0; v < numTiles; v++) {
        if (!sptSet[v] && graph[u][v] !== 0 &&
          dist[u] !== Number.MAX_VALUE &&
          dist[u] + graph[u][v] < dist[v]) {
          p[v] = u;
          dist[v] = dist[u] + graph[u][v];
        }
      }
      if (u === target) {
        break;
      }
    }
    const array = this.createPathList(p, target, [], 0);
    return {path: array, steps: display};
  }

  minDistance(dist: number[], sptSet: boolean[], numTiles): any
  {

    let min = Number.MAX_VALUE;

    let min_index = -1;

    for (let v = 0; v < numTiles; v++)
    {
      if (sptSet[v] === false && dist[v] < min)
      {
        min = dist[v];
        min_index = v;
      }
    }
    return min_index;
  }
  createPathList(p: number[], j: number, test: any[], i: number): any
  {

    if (p[j] === - 1) {
      test.push(j);
      return test;
    }

    test = this.createPathList(p, p[j], test, i++);
    test.push(j);
    return test;
  }
}
