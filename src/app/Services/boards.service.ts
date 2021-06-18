import { Injectable } from '@angular/core';
import {Globals} from '../globals';
import {RecursiveMazeService} from './boards/recursive-maze.service';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor(private globals: Globals, private recursiveMaze: RecursiveMazeService) { }

  generateBoard(algorithm: any, rows: number, cols: number): any {
    switch (algorithm){
      case 'Recursive Maze':
        return this.recursiveMaze.generateBoard(rows, cols);
    }
  }
}
