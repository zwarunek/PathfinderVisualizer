import {Component, OnInit} from '@angular/core';
import {AlgorithmsService} from '../Services/algorithms.service';
import {Globals} from '../globals';
import {BoardsService} from '../Services/boards.service';

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
  boards: any[];
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
  constructor(public globals: Globals, private algorithms: AlgorithmsService, private boardService: BoardsService) {
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

    this.boards = ['Recursive Maze'];
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

  removeFromGraph(i: number): void{
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

  addEdge(i: number, j: number, distance: number): void{
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

  mouseEnter(e: MouseEvent, row: any, col: any): void {
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

      this.setNonWall('start', row, col);
    }
    else if (this.draggingEnd && this.tiles[row][col].type !== 'start'){
      this.endTile = {row, col};
      if (this.tiles[row][col].type === 'wall'){
        this.addToGraph(row * this.cols + col, col, row);
      }

      this.setNonWall('end', row, col);
    }
    else if (this.draggingWall && this.tiles[row][col].type !== 'start' && this.tiles[row][col].type !== 'end'){
      this.setWall(row, col);
    }
    else if (this.draggingBlank && this.tiles[row][col].type !== 'start' && this.tiles[row][col].type !== 'end'){
      this.setNonWall('blank', row, col);
    }
  }

  mouseDown(e: MouseEvent, row: any, col: any): void {
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
      this.setWall(row, col);
    }
    else if (e.buttons === 2) {
      this.draggingBlank = true;
      this.setNonWall('blank', row, col);
    }
  }

  mouseLeave(e: MouseEvent, row: any, col: any): void {

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
  mouseUp(): void {
    this.draggingStart = this.draggingEnd = this.draggingWall = this.draggingBlank = false;
  }

  setWall(row, col): void{
    this.tiles[row][col].type = 'wall';
    this.tiles[row][col].distance = 0;
    this.removeFromGraph(row * this.cols + col);
    if (this.globals.finished){
      this.visualize(0);
    }
  }
  setNonWall(type: any, row, col): void{
    this.tiles[row][col].type = type;
    this.tiles[row][col].distance = 1;
    const neighbors = this.findNeighbors(row, col);
    for (const neighbor of neighbors) {
      this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
        neighbor.row * this.cols + neighbor.col,
        neighbor.col !== col && neighbor.row !== row ? Math.sqrt(2) : 1);
    }
    if (this.globals.finished){
      this.visualize(0);
    }
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

    return { weight: 1, x1, y1, x2, y2 };

  }
  visualize(delay: number): void {
    this.globals.inProgress = true;
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
          for (const neighbor of neighbors) {
            this.addEdge(row * this.cols + col,
              neighbor.row * this.cols + neighbor.col,
              neighbor.col !== col && neighbor.row !== row ? Math.sqrt(2) : 1);
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
    for (const step of path.steps){
      if (this.globals.inProgress === false){
        return;
      }

      const tile = {row: Math.floor(step / this.cols), col:  step % this.cols};
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

  changeSpeed(delay: any): void {
    this.resetLine();
    this.delay = parseInt(delay, 10);
    // for (let i = 0; i < this.rows; i++) {
    //   for (let j = 0; j < this.cols; j++) {
    //     const tile = document.getElementById('tile-' + i + ':' + j);
    //     // tile.style.animation = 'none';
    //   }
    // }
  }
  printMatrix(): void {
    let str = '';
    for (const vertex of this.tileGraph){
      str = str + vertex + '\n';
    }
    console.log(str);
  }

  cancel(): void {
    this.globals.inProgress = false;
    this.globals.noPath = true;
  }

  async loadBoard(): Promise<void> {
    this.boardLoading = true;
    this.resetLine();
    this.resetTiles();
    if (this.selectedBoard === undefined){
      this.boardLoading = false;
      return;
    }
    const walls = this.boardService.generateBoard(this.selectedBoard, this.rows, this.cols);

    for (const wall of walls){
      if (this.tiles[wall[0]][wall[1]].type !== 'start' && this.tiles[wall[0]][wall[1]].type !== 'end') {
        this.tiles[wall[0]][wall[1]].type = 'wall';
        this.tiles[wall[0]][wall[1]].distance = 0;
        this.removeFromGraph(wall[0] * this.cols + wall[1]);
        await this.sleep(1);
      }
    }
    this.boardLoading = false;

  }
}
