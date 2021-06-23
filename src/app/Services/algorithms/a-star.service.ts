import { Injectable } from '@angular/core';
import {Globals} from '../../globals';
import {newArray} from '@angular/compiler/src/util';
import {GraphUtilsService} from '../graph-utils.service';

export interface Node {
  index: number[];
  f: number;
}
export interface Cell {
  f: number;
  g: number;
  h: number;
  p_row: number;
  p_col: number;
}

@Injectable({
  providedIn: 'root'
})
export class AStarService {

  constructor(private globals: Globals, private graphUtils: GraphUtilsService) { }

  pathFind(graph: number[][],
           src: number[],
           target: number[],
           rows: number,
           cols: number,
           diagonal: boolean,
           boardType: string): { path; steps } {
    const open: Node[] = [];
    const closed: boolean[][] = newArray(rows).fill(newArray(cols).fill(false));
    const details: Cell[][] = [];
    const display = [];
    for (let i = 0; i < rows; i++) {
      details[i] = [];
      for (let j = 0; j < cols; j++) {
        details[i][j] = {
          f: Number.MAX_SAFE_INTEGER,
          g: Number.MAX_SAFE_INTEGER,
          h: Number.MAX_SAFE_INTEGER,
          p_row: -1,
          p_col: -1
        };
      }
    }

    open.push({index: src, f: 0});
    details[src[0]][src[1]].f = 0;
    details[src[0]][src[1]].g = 0;
    details[src[0]][src[1]].h = 0;
    details[src[0]][src[1]].p_row = src[0];
    details[src[0]][src[1]].p_col = src[1];
    details[0][0].f = 1;
    while (open.length > 0){
      let q = open[0];
      for (let i = open.length - 1; i >= 0; i--) {
        if (open[i].f < q.f) {q = open[i]; }
      }
      open.splice(open.indexOf(q), 1);
      if (display.indexOf(q.index[0] * cols + q.index[1]) === -1) {
        display.push(q.index[0] * cols + q.index[1]);
      }
      const neighbors = boardType === 'square' ?
        this.graphUtils.findNeighborsSquare(q.index[0], q.index[1], rows, cols, diagonal) :
        this.graphUtils.findNeighborsHex(q.index[0], q.index[1], rows, cols);
      for (const neighbor of neighbors){
        const cost = graph[q.index[0] * cols + q.index[1]][neighbor.row * cols + neighbor.col];
        const row = neighbor.row;
        const col = neighbor.col;
        if (cost > 0){
          const s = details[row][col];
          if (row === target[0] && col === target[1]) {
            s.p_row = q.index[0];
            s.p_col = q.index[1];
            s.g = details[q.index[0]][q.index[1]].g + cost;
            if (diagonal){
              const dx = Math.abs(col - target[1]);
              const dy = Math.abs(row - target[0]);
              s.h = 1 * (dx + dy) + (Math.sqrt(2) - 2 * 1 ) * Math.min(dx, dy);
            }
            else if (boardType === 'hex'){
              const dx = Math.abs(col - target[1]);
              const dy = Math.abs(row - target[0]);
              s.h = 1 * (dx + dy) + (1 - 2 * 1 ) * Math.min(dx, dy);
            }
            else {
              s.h = Math.abs(col - target[1]) + Math.abs(row - target[0]);
            }
            s.f = s.g + s.h;
            const tempPath = this.getPath(target[0], target[1], details, src);
            return {
              path: tempPath,
              steps: display
            };
          }
          else if (closed[row][col] === false){
            const gNew = details[q.index[0]][q.index[1]].g + cost;
            let hNew;
            if (diagonal){
              const dx = Math.abs(col - target[1]);
              const dy = Math.abs(row - target[0]);
              hNew = 1 * (dx + dy) + (Math.sqrt(2) - 2 * 1 ) * Math.min(dx, dy);
            }
            else if (boardType === 'hex'){
              const dx = Math.abs(col - target[1]);
              const dy = Math.abs(row - target[0]);
              hNew = 1 * (dx + dy) + (1 - 2 * 1 ) * Math.min(dx, dy);
            }
            else {
              hNew = Math.abs(col - target[1]) + Math.abs(row - target[0]);
            }
            const fNew = gNew + hNew;

            if (details[row][col].f === Number.MAX_SAFE_INTEGER || details[row][col].f > fNew) {
              open.push({index: [row, col], f: fNew});
              s.f = fNew;
              s.g = gNew;
              s.h = hNew;
              s.p_row = q.index[0];
              s.p_col = q.index[1];
            }
          }
        }
      }
    }
    return {
      path: undefined,
      steps: display
    };
  }

  private getPath(row, col, details: Cell[][], src, path= []): any[] {

    if (row === src[0] && col === src[1]) {
      path.push(row * details[0].length + col);
      path.push(details[row][col].p_row * details[0].length + details[row][col].p_col);
      return path;
    }

    path = this.getPath(details[row][col].p_row, details[row][col].p_col, details, src, path);
    path.push(row * details[0].length + col);
    return path;
  }
}
