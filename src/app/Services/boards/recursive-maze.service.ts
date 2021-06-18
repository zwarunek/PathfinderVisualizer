import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecursiveMazeService {

  constructor() { }

  generateBoard(rows: number, cols: number): any {
    const newBoard = [];
    for (let row = 0; row < rows; row++){
      for (let col = 0; col < cols; col++){
        if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1){
          newBoard.push([row, col]);
        }
      }
    }
    this.genRow(newBoard, 1, rows - 2, 1,  cols - 2, []);
    // tslint:disable-next-line:max-line-length
    return newBoard;
  }
  genRow(newBoard, rowStart, rowEnd,  colStart, colEnd, prevHole): number{
    const cols = 3;
    const hole = [this.getNewHole(colStart, colEnd)];
    const rowNum = this.genRowCol(rowStart, rowEnd - 1, prevHole);
    for (let col = colStart; col <= colEnd; col++){
      if (!hole.includes(col)){
        newBoard.push([rowNum, col]);
      }
    }
    const lowerColBounds = [colStart, colEnd];
    const upperColBounds = [colStart, colEnd];
    const lowerHole: any[] = [];
    const upperHole: any[] = [];

    for (let i = 0; i < cols; i++){
      if (this.hasRoom(lowerColBounds.concat(hole), colStart, colEnd)){
        lowerColBounds.push(this.genRowCol(colStart, colEnd, lowerColBounds.concat(hole)));
      }
      if (this.hasRoom(upperColBounds.concat(hole), colStart, colEnd)){
        upperColBounds.push(this.genRowCol(colStart, colEnd, upperColBounds.concat(hole)));
      }
    }

    lowerColBounds.sort((a, b) => {
      return a - b;
    });
    upperColBounds.sort((a, b) => {
      return a - b;
    });
    if (rowEnd - rowNum > 2) {
      for (let i = 0; i < upperColBounds.length - 2; i++) {
        lowerHole.push(this.genCol(newBoard, rowNum + 1, rowEnd, lowerColBounds[i + 1]));
      }
      for (let i = 0; i < lowerColBounds.length - 1; i++){
        this.genRow(newBoard, rowNum + 1, rowEnd, lowerColBounds[i], lowerColBounds[i + 1], [lowerHole[i]]);
      }
    }
    if (rowNum - rowStart > 2) {
      for (let i = 0; i < upperColBounds.length - 2; i++) {
        upperHole.push(this.genCol(newBoard, rowStart, rowNum - 1, upperColBounds[i + 1]));
      }
      for (let i = 0; i < upperColBounds.length - 1; i++){
        this.genRow(newBoard, rowStart, rowNum - 1, upperColBounds[i], upperColBounds[i + 1], [upperHole[i]]);
      }
    }
    return rowNum;
  }
  genCol(newBoard, rowStart, rowEnd, colNum): number{

    const hole = this.getNewHole(rowStart, rowEnd);

    for (let row = rowStart; row <= rowEnd; row++){
      if (row !== hole){
        newBoard.push([row, colNum]);
      }
    }
    return hole;
  }
  genRowCol(min, max, hole: any[]): number {
    const num = this.randomInt(min, max);
    if (num % 2 === 0 && !hole.includes(num)){
      return num;
    }
    return this.genRowCol(min, max, hole);
  }
  getNewHole(min, max): number{
    const num = this.randomInt(min, max);
    if (num % 2 === 1){
      return num;
    }
    return this.getNewHole(min, max);
  }
  randomInt(min, max): number{
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  hasRoom(list: any[], low: number, high: number): any {
    for (let i = low + 1; i < high; i ++){
      if (!list.includes(i) && (i % 2) === 0){
        return true;
      }
    }
    return false;
  }
}
