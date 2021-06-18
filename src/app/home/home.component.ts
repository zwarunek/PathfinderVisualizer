import {Component, OnInit} from '@angular/core';
// @ts-ignore
import data from '../../assets/boards.json';
import {AlgorithmsService} from '../Services/algorithms.service';
import {global} from '@angular/compiler/src/util';
import {Globals} from '../globals';

export interface Tile {
  type: any;
  distance: any;
}
export interface Line{
  weight: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
export interface Coords {
  row: number;
  col: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  draggingWall = false;
  draggingBlank = false;
  draggingStart = false;
  draggingEnd = false;
  boardsJson = data;
  boardLoading = false;

  lines: any[] = [];
  // inProgress = false;
  // finished = false;
  // noPath = false;

  delay = 5;

  startTile: {row: any, col: any};
  endTile: {row: any, col: any};

  cols = Math.floor((window.innerWidth - 40) / 28) - (Math.floor((window.innerWidth - 40) / 28) % 2 === 1 ? 0 : 1);
  rows = Math.floor((window.innerHeight - 104) / 28) - (Math.floor((window.innerHeight - 104) / 28) % 2 === 1 ? 0 : 1);
  numTiles = this.cols * this.rows;
  tiles: Tile[][];
  tileGraph: number[][];
  adjList: any[][] = [];
  diagonal = false;
  // temp: any[][] = [];

// 12x12 12x52
  grid = true;
  selectedBoard: any;
  constructor(public globals: Globals, private algorithms: AlgorithmsService) {
    this.tiles = [];
    for (let i = 0; i < this.rows; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.tiles[i][j] = {type: 'blank', distance: 1};
      }
    }
    this.tiles[Math.floor(this.rows / 2) - 1][Math.floor(this.cols / 6)] = {type: 'start', distance: 1};
    this.startTile = {row: Math.floor(this.rows / 2) - 1, col: Math.floor(this.cols / 6)};
    this.tiles[Math.floor(this.rows / 2) - 1][this.cols - Math.floor(this.cols / 6)] = {type: 'end', distance: 1};
    this.endTile = {row: Math.floor(this.rows / 2) - 1, col: this.cols - Math.floor(this.cols / 6)};
    this.tileGraph = [];
    this.setGraph();
  }

  ngOnInit(): void{
  }

  setGraph(): void {
    for (let i = 0; i < this.numTiles; i++) {
      this.tileGraph[i] = [];
      for (let j = 0; j < this.numTiles; j++) {
        this.tileGraph[i][j] = 0;
      }
    }

    for (let r = 0; r < this.rows; r++){
      for (let c = 0; c < this.cols; c++){
        const i = r * this.cols + c;
        this.addToGraph(i, c, r);
      }
    }
  }

  removeFromGraph(i: number){
    this.tileGraph[i] = new Array(this.numTiles).fill(0);
    for (let row = 0; row < this.tileGraph.length; row++){
      if (row !== i) {
        this.tileGraph[row][i] = 0;
      }
    }
  }

  addToGraph(i: number, c: number, r: number): void {
    if (c > 0){
      this.tileGraph[i - 1][i] = this.tileGraph[i][i - 1] =
        this.tiles[Math.floor((i - 1) / this.cols)][(i - 1) % this.cols].distance *
        this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
    }
    if (r > 0){
      this.tileGraph[i - this.cols][i] = this.tileGraph[i][i - this.cols] =
        this.tiles[Math.floor((i - this.cols) / this.cols)][(i - this.cols) % this.cols].distance *
        this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
    }
    if (this.diagonal) {
      if (i > this.cols && c > 0) {
        this.tileGraph[i - this.cols - 1][i] = this.tileGraph[i][i - this.cols - 1] =
          this.tiles[Math.floor((i - this.cols - 1) / this.cols)][(i - this.cols - 1) % this.cols].distance *
          this.tiles[Math.floor(i / this.cols)][i % this.cols].distance * Math.sqrt(2);
      }
      if (i > this.cols - 1 && c !== this.cols - 1) {
        this.tileGraph[i - this.cols + 1][i] = this.tileGraph[i][i - this.cols + 1] =
          this.tiles[Math.floor((i - this.cols + 1) / this.cols)][(i - this.cols + 1) % this.cols].distance *
          this.tiles[Math.floor(i / this.cols)][i % this.cols].distance * Math.sqrt(2);
      }
    }
  }

  addEdge(i: number, j: number, distance: number){
    this.tileGraph[i][j] = this.tileGraph[j][i] = distance;
  }

  findNeighbors(row: number, col: number): Coords[] {
    const neighbors = [];
    if (col + 1 < this.cols && this.tiles[row][col + 1].distance === 1) { // right
      neighbors.push({row, col: col + 1});
    }
    if (col - 1 >= 0 && this.tiles[row][col - 1].distance === 1) { // left
      neighbors.push({row, col: col - 1});
    }
    if (row + 1 < this.rows && this.tiles[row + 1][col].distance === 1) { // down
      neighbors.push({row: (row + 1), col});
    }
    if (row - 1 >= 0 && this.tiles[row - 1][col].distance === 1) { // up
      neighbors.push({row: (row - 1), col});
    }
    if (this.diagonal){
      if (col + 1 < this.cols && row - 1 >= 0 && this.tiles[row - 1][col + 1].distance === 1) {
        neighbors.push({row: (row - 1), col: col + 1});
      }
      if (col - 1 >= 0 && row - 1 >= 0 && this.tiles[row - 1][col - 1].distance === 1) {
        neighbors.push({row: (row - 1), col: col - 1});
      }
      if (col + 1 < this.cols && row + 1 < this.rows && this.tiles[row + 1][col + 1].distance === 1) {
        neighbors.push({row: (row + 1), col: col + 1});
      }
      if (col - 1 >= 0 && row + 1 < this.rows && this.tiles[row + 1][col - 1].distance === 1) {
        neighbors.push({row: (row + 1), col: col - 1});
      }
    }
    return neighbors;

  }

  mouseEnter(e: MouseEvent, row: any, col: any) {
    if (this.globals.inProgress){
      return;
    }
    if (e.buttons === 0){
      this.draggingStart = this.draggingEnd = this.draggingWall = this.draggingBlank = false;
    }
    else if (!this.draggingWall && e.buttons === 1) {
      this.draggingWall = true;
      this.draggingBlank = false;
    }
    else if (!this.draggingBlank && e.buttons === 2) {
      this.draggingBlank = true;
      this.draggingWall = false;
    }

    if (this.draggingStart && this.tiles[row][col].type !== 'end'){
      this.startTile = {row, col};
      if (this.tiles[row][col].type === 'wall'){
        this.addToGraph(row * this.cols + col, col, row);
      }
      this.tiles[row][col].type = 'start';
      this.tiles[row][col].distance = 1;
      const neighbors = this.findNeighbors(row, col);
      for (let i = 0; i < neighbors.length; i++) {
        this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
          neighbors[i].row * this.cols + neighbors[i].col,
          neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
      }

      if (this.globals.finished){
        this.visualize(0);
      }
    }
    else if (this.draggingEnd && this.tiles[row][col].type !== 'start'){
      this.endTile = {row, col};
      if (this.tiles[row][col].type === 'wall'){
        this.addToGraph(row * this.cols + col, col, row);
      }
      this.tiles[row][col].type = 'end';
      this.tiles[row][col].distance = 1;
      const neighbors = this.findNeighbors(row, col);
      for (let i = 0; i < neighbors.length; i++) {
        this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
          neighbors[i].row * this.cols + neighbors[i].col,
          neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
      }
      if (this.globals.finished){
        this.visualize(0);
      }
    }
    else if (this.draggingWall && this.tiles[row][col].type !== 'start' && this.tiles[row][col].type !== 'end'){
      // this.temp.push([row, col]);
      this.tiles[row][col].type = 'wall';
      this.tiles[row][col].distance = 0;
      this.removeFromGraph(row * this.cols + col);
      if (this.globals.finished){
        this.visualize(0);
      }
    }
    else if (this.draggingBlank && this.tiles[row][col].type !== 'start' && this.tiles[row][col].type !== 'end'){
      this.tiles[row][col].type = 'blank';
      this.tiles[row][col].distance = 1;
      const neighbors = this.findNeighbors(row, col);
      for (let i = 0; i < neighbors.length; i++) {
        this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
          neighbors[i].row * this.cols + neighbors[i].col,
          neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
      }
      if (this.globals.finished){
        this.visualize(0);
      }
    }
  }

  mouseDown(e: MouseEvent, row: any, col: any) {
    if (this.globals.inProgress){
      return;
    }
    if (this.tiles[row][col].type === 'start'){
      this.draggingStart = true;
    }
    else if (this.tiles[row][col].type === 'end'){
      this.draggingEnd = true;
    }
    else if (e.buttons === 1) {
      this.draggingWall = true;
      // this.temp.push([row, col]);
      this.tiles[row][col].type = 'wall';
      this.tiles[row][col].distance = 0;
      this.removeFromGraph(row * this.cols + col);
      if (this.globals.finished){
        this.visualize(0);
      }
    }
    else if (e.buttons === 2) {
      this.draggingBlank = true;
      this.tiles[row][col].type = 'blank';
      this.tiles[row][col].distance = 1;
      const neighbors = this.findNeighbors(row, col);
      for (let i = 0; i < neighbors.length; i++) {
        this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
          neighbors[i].row * this.cols + neighbors[i].col,
          neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
      }
      if (this.globals.finished){
        this.visualize(0);
      }
    }
  }

  mouseLeave(e: MouseEvent, row: any, col: any) {
    // console.log((e.target as Element).id + ' -> ' + (e.relatedTarget as Element).id);

    if (this.globals.inProgress){
      return;
    }
    if (this.draggingStart && this.tileElementToTile((e.target as Element).id).type !== 'end'){
      this.tiles[row][col].type = 'blank';
      this.tiles[row][col].distance = 1;
      document.getElementById('tile-' + row + ':' + col).style.animation = 'none';
    }
    if (this.draggingEnd && this.tileElementToTile((e.target as Element).id).type !== 'start'){
      this.tiles[row][col].type = 'blank';
      this.tiles[row][col].distance = 1;
      document.getElementById('tile-' + row + ':' + col).style.animation = 'none';
    }
  }

  mouseUp(e: MouseEvent, row: any, col: any) {
    this.draggingStart = this.draggingEnd = this.draggingWall = this.draggingBlank = false;
  }
  tileElementToTile(id: any): Tile{
    const indices = id.split('-')[1].split(':');
    return this.tiles[indices[0]][indices[1]];
  }
  getOffset( el ): any {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    };
  }
  connect(div1, div2): Line { // draw a line connecting elements
    div1 = document.getElementById(div1);
    div2 = document.getElementById(div2);
    const off1 = this.getOffset(div1);
    const off2 = this.getOffset(div2);

    const x1 = (off1.left + off1.width / 2);
    const y1 = (off1.top + off1.height / 2);

    const x2 = (off2.left + off2.width / 2);
    const y2 = (off2.top + off2.height / 2);

    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1))) + 3;

    return { weight: 1, x1, y1, x2, y2 };

  }
  visualize(delay: number): void {
    // this.printMatrix();
    // this.printBoard();
    this.globals.inProgress = true;
    // console.log('inside visualize');
    this.resetLine();
    const path = this.algorithms.runPathfindingAlgorithm('dijkstra', this.tileGraph,
      parseInt(this.startTile.row, 10) * this.cols + parseInt(this.startTile.col, 10),
      parseInt(this.endTile.row, 10) * this.cols + parseInt(this.endTile.col, 10),
      this.numTiles);
    this.displayPath(path, delay).then(() => {
      this.globals.inProgress = false;
      this.globals.finished = true;
    });
    // this.dijkstra(this.tileGraph, delay);
  }

  resetLine(): void {
    this.lines = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const tile = document.getElementById('tile-' + i + ':' + j);
        tile.style.animation = 'none';
        tile.classList.remove('searched');
        tile.style.animation = '';
      }
    }
    this.globals.finished = false;
    this.globals.noPath = false;
  }
  resetTiles(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.tiles[row][col].type === 'wall') {
          const tile = document.getElementById('tile-' + row + ':' + col);
          tile.style.animation = 'none';
          this.tiles[row][col] = {type: 'blank', distance: 1};
          const neighbors = this.findNeighbors(row, col);
          for (let i = 0; i < neighbors.length; i++) {
            this.addEdge(row * this.cols + col,
              neighbors[i].row * this.cols + neighbors[i].col,
              neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
          }
          tile.style.animation = '';
        }
      }
    }
    if (this.globals.finished) {
      this.visualize(0);
    }
  }
  async displayPath(path: {path, steps}, delay: number): Promise<void>{
    for (let i = 0; i < path.steps.length; i++){
      if (this.globals.inProgress === false){
        return;
      }

      const tile = {row: Math.floor(path.steps[i] / this.cols), col:  path.steps[i] % this.cols};
      if (this.tiles[tile.row][tile.col].type !== 'start' &&
        this.tiles[tile.row]  [tile.col].type !== 'end' &&
        this.tiles[tile.row]  [tile.col].type !== 'wall') {
        const tileElement = document.getElementById('tile-' + tile.row + ':' + tile.col);
        tileElement.classList.remove('blank');
        tileElement.classList.add('searched');
        if (delay > 0){
          await this.sleep(delay);
        }
      }
    }
    for (let i = 0; i < path.path.length - 1; i++) {
      if (delay > 0) {
        await this.sleep(10);
      }
      this.lines.push(this.connect('tile-' + Math.floor(path.path[i] / this.cols) + ':' + path.path[i] % this.cols,
        'tile-' + Math.floor(path.path[i + 1] / this.cols) + ':' + path.path[i + 1] % this.cols));
    }
  }
  sleep(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  diagonalChange(): void {
    this.setGraph();
    if (this.globals.finished){
      this.visualize(0);
    }
    else {
      this.resetLine();
    }
  }

  changeSpeed(delay: any) {
    this.resetLine();
    this.delay = parseInt(delay, 10);
    // for (let i = 0; i < this.rows; i++) {
    //   for (let j = 0; j < this.cols; j++) {
    //     const tile = document.getElementById('tile-' + i + ':' + j);
    //     // tile.style.animation = 'none';
    //   }
    // }
  }
  printMatrix(){
    let str = '';
    for (let i = 0; i < this.tileGraph.length; i++){
      // for (let j = 0; i < this.tileGraph.length; j++){
      str = str + this.tileGraph[i] + '\n';
      // }
    }
    console.log(str);
  }

  cancel() {
    this.globals.inProgress = false;
    this.globals.noPath = true;
  }
  // printBoard(){
  //   let str = '';
  //   for (let i = 0; i < this.temp.length; i++){
  //     str = str.concat('[' + this.temp[i][0] + ',' + this.temp[i][1] + ']\n');
  //   }
  //   console.log(str);
  // }

  async loadBoard() {
    this.boardLoading = true;
    this.selectedBoard = '1';
    this.resetTiles();
    if (this.selectedBoard === undefined){
      this.boardLoading = false;
      return;
    }
    if (this.selectedBoard === '1'){
      this.genNewBoard();
    }
    const json = data[this.selectedBoard].walls;
    for (let i = 0; i < json.length; i++){
      // console.log(this.tiles, json[i][0], json[i][1]);
      if (this.tiles[json[i][0]][json[i][1]].type !== 'start' && this.tiles[json[i][0]][json[i][1]].type !== 'end') {
        this.tiles[json[i][0]][json[i][1]].type = 'wall';
        this.tiles[json[i][0]][json[i][1]].distance = 0;
        this.removeFromGraph(json[i][0] * this.cols + json[i][1]);
        await this.sleep(1);
      }
    }
    this.boardLoading = false;

  }
  // genSection(newBoard: any, cols: number, rowInput: number, colInput: number, hole: number): void{
  //   this.genRow(newBoard, rowInput, 1, cols, hole);
  // }
  genRow(newBoard, rowStart, rowEnd,  colStart, colEnd, prevHole): number{
    // if (rowEnd - rowStart < 2){
    //   return;
    // }
    const cols = 3;
    // console.log(colStart, colEnd)
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
      // console.log(colStart, colEnd - 2, lowerColBounds.concat(hole), this.hasRoom(lowerColBounds.concat(hole), colStart, colEnd - 2));
      if (this.hasRoom(lowerColBounds.concat(hole), colStart, colEnd)){
        lowerColBounds.push(this.genRowCol(colStart, colEnd, lowerColBounds.concat(hole)));
      }
      // console.log(colStart, colEnd - 2, upperColBounds.concat(hole), this.hasRoom(upperColBounds.concat(hole), colStart, colEnd - 2));
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
    // console.log(lowerColBounds.length)
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
    // for (let i = 0; i < cols; i++) {
    //   if (rowNum - rowStart >= 2 && upperColBounds.length === cols + 2) {
    //     upperHole.push(this.genCol(newBoard, rowStart, rowNum, upperColBounds[i + 1]));
    //   }
    // }
    return rowNum;
  }
  genCol(newBoard, rowStart, rowEnd, colNum): number{

    // console.log(rowStart, rowEnd)
    const hole = this.getNewHole(rowStart, rowEnd);

    for (let row = rowStart; row <= rowEnd; row++){
      if (row !== hole){
        newBoard.push([row, colNum]);
      }
    }
    // for (let i = 0; i < 1; i++) {
    // if (colEnd - colNum >= 2){
    //   hole.push(this.genRow(newBoard, rowStart, rowEnd, colNum + 1, colEnd, hole));
    // }
    // }
    return hole;
  }
  genNewBoard(): void {
    const newBoard = [];
    for (let row = 0; row < this.rows; row++){
      for (let col = 0; col < this.cols; col++){
        if (row === 0 || row === this.rows - 1 || col === 0 || col === this.cols - 1){
          newBoard.push([row, col]);
        }
      }
    }
    this.genRow(newBoard, 1, this.rows - 2, 1,  this.cols - 2, [this.startTile.row]);
    // tslint:disable-next-line:max-line-length
    this.boardsJson[1].walls = newBoard;
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

  // low/high exclusive
  private hasRoom(list: any[], low: number, high: number) {
    for (let i = low + 1; i < high; i ++){
      if (!list.includes(i) && (i % 2) === 0){
        return true;
      }
    }
    return false;
  }
}
