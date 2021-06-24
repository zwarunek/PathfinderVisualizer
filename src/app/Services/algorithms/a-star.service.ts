import { Injectable } from '@angular/core';
import {Globals} from '../../globals';
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
           heuristic: string,
           diagonal: boolean,
           boardType: string): { path; steps } {
    const open: Node[] = [];
    const closed: any[][] = [];
    for (let i = 0; i < rows; i++) {
      closed[i] = [];
      for (let j = 0; j < cols; j++) {
        closed[i][j] = false;
      }
    }
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
            s.h = this.getH(row, col, target, src, heuristic);
            s.f = s.g + s.h;
            const tempPath = this.getPath(target[0], target[1], details, src);
            return {
              path: tempPath,
              steps: display
            };
          }
          else if (closed[row][col] === false){
            const gNew = details[q.index[0]][q.index[1]].g + cost;
            const hNew = this.getH(row, col, target, src, heuristic);
            const fNew = gNew + hNew;

            if (display.indexOf(row * cols + col) === -1) {
              display.push(row * cols + col);
            }
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

  private getH(row: number, col: number, target: number[], src: number[], heuristic: string): number {
    if (heuristic === 'octile'){
      const dx = Math.abs(col - target[1]);
      const dy = Math.abs(row - target[0]);
      const dx1 = col - target[1];
      const dy1 = row - target[0];
      const dx2 = src[1] - target[1];
      const dy2 = src[0] - target[0];
      const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
      // heuristic += cross*0.001
      return 1 * (dx + dy) + (Math.sqrt(2) - 2 * 1 ) * Math.min(dx, dy) + cross * 0.001;
    }
    else if (heuristic === 'hex'){
      const a = this.oddq_to_cube(row, col);
      const b = this.oddq_to_cube(target[0], target[1]);
      return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
    }
    else if (heuristic === 'euclidean'){
      return Math.sqrt(Math.pow(col - target[1], 2) + Math.pow(row - target[0], 2));
    }
    else if (heuristic === 'manhattan'){
      const dx1 = col - target[1];
      const dy1 = row - target[0];
      const dx2 = src[1] - target[1];
      const dy2 = src[0] - target[0];
      const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
      return (Math.abs(col - target[1]) + Math.abs(row - target[0])) + cross * 0.001;
    }
  }

  private oddq_to_cube(row, col): any {
    const x = col;
    // tslint:disable-next-line:no-bitwise
    const z = row - (col - (col & 1)) / 2;
    const y = -x - z;
    return {x, y, z};
  }
}
