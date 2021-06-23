import { Injectable } from '@angular/core';
import {Coords} from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class GraphUtilsService {

  constructor() { }

  findNeighborsSquare(row: number, col: number, rows: number, cols: number, diagonal): Coords[] {
    const neighbors = [];
    if (col + 1 < cols) { // right
      neighbors.push({row, col: col + 1});
    }
    if (col - 1 >= 0) { // left
      neighbors.push({row, col: col - 1});
    }
    if (row + 1 < rows) { // down
      neighbors.push({row: (row + 1), col});
    }
    if (row - 1 >= 0) { // up
      neighbors.push({row: (row - 1), col});
    }
    if (diagonal){
      if (col + 1 < cols && row - 1 >= 0) {
        neighbors.push({row: (row - 1), col: col + 1});
      }
      if (col - 1 >= 0 && row - 1 >= 0) {
        neighbors.push({row: (row - 1), col: col - 1});
      }
      if (col + 1 < cols && row + 1 < rows) {
        neighbors.push({row: (row + 1), col: col + 1});
      }
      if (col - 1 >= 0 && row + 1 < rows) {
        neighbors.push({row: (row + 1), col: col - 1});
      }
    }
    return neighbors;

  }
  findNeighborsHex(row: number, col: number, rows: number, cols: number): Coords[] {
    const neighbors = [];
    if (col + 1 < cols) { // right
      neighbors.push({row, col: col + 1});
    }
    if (col - 1 >= 0) { // left
      neighbors.push({row, col: col - 1});
    }
    if (col + 1 < cols &&
      ((col % 2) === 1 ? row + 1 < rows : row - 1 >= 0)) { // right diagonal
      neighbors.push({row: row + ((col % 2) === 1 ? 1 : -1), col: col + 1});
    }
    if (col - 1 >= 0  &&
      ((col % 2) === 1 ? row + 1 < rows : row - 1 >= 0)) { // left diagonal
      neighbors.push({row: row + ((col % 2) === 1 ? 1 : -1), col: col - 1});
    }
    if (row + 1 < rows) { // down
      neighbors.push({row: (row + 1), col});
    }
    if (row - 1 >= 0) { // up
      neighbors.push({row: (row - 1), col});
    }

    return neighbors;

  }
}
