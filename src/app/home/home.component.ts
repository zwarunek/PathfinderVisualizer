import {Component, HostListener, OnInit} from '@angular/core';
import {newArray} from '@angular/compiler/src/util';
import { KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Observable, timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {MatButtonToggleChange} from '@angular/material/button-toggle';

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

  lines: any[] = [];
  inProgress = false;
  finished = false;
  noPath = false;

  delay = 1;

  startTile: {row: any, col: any};
  endTile: {row: any, col: any};

  cols = 67;
  rows = 25;
  numTiles = this.cols * this.rows;
  tiles: Tile[][];
  tileGraph: number[][];
  adjList: any[][] = [];
  diagonal = false;

// 12x12 12x52
  grid = true;
  constructor() {
    this.tiles = [];
    for (let i = 0; i < this.rows; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.tiles[i][j] = {type: 'blank', distance: 1};
      }
    }
    this.tiles[12][12] = {type: 'start', distance: 1};
    this.startTile = {row: 12, col: 12};
    this.tiles[12][52] = {type: 'end', distance: 1};
    this.endTile = {row: 12, col: 52};
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
    if (this.inProgress){
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

      if (this.finished){
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
      if (this.finished){
        this.visualize(0);
      }
    }
    else if (this.draggingWall && this.tiles[row][col].type !== 'start' && this.tiles[row][col].type !== 'end'){
      this.tiles[row][col].type = 'wall';
      this.tiles[row][col].distance = 0;
      this.removeFromGraph(row * this.cols + col);
      if (this.finished){
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
      if (this.finished){
        this.visualize(0);
      }
    }
  }

  mouseDown(e: MouseEvent, row: any, col: any) {
    if (this.inProgress){
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
      this.tiles[row][col].type = 'wall';
      this.tiles[row][col].distance = 0;
      this.removeFromGraph(row * this.cols + col);
      if (this.finished){
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
      if (this.finished){
        this.visualize(0);
      }
    }
  }

  mouseLeave(e: MouseEvent, row: any, col: any) {
    // console.log((e.target as Element).id + ' -> ' + (e.relatedTarget as Element).id);

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
    this.inProgress = true;
    // console.log('inside visualize');
    this.resetLine();
    this.dijkstra(this.tileGraph, delay);
  }

  resetLine(): void {
    this.lines = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        document.getElementById('tile-' + i + ':' + j).classList.remove('searched');
      }
    }
    this.finished = false;
    this.noPath = false;
  }
  resetTiles(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.tiles[row][col].type === 'wall') {
          this.tiles[row][col] = {type: 'blank', distance: 1};
          const neighbors = this.findNeighbors(row, col);
          for (let i = 0; i < neighbors.length; i++) {
            this.addEdge(row * this.cols + col,
              neighbors[i].row * this.cols + neighbors[i].col,
              neighbors[i].col !== col && neighbors[i].row !== row ? Math.sqrt(2) : 1);
          }
        }
      }
    }
    if (this.finished) {
      this.visualize(0);
    }
  }
  minDistance(dist: number[], sptSet: boolean[]): any
  {

    let min = Number.MAX_VALUE;

    let min_index = -1;

    for (let v = 0; v < this.numTiles; v++)
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
      test.push('tile-' + Math.floor(j / this.cols) + ':' + j % this.cols);
      return test;
    }

    test = this.createPathList(p, p[j], test, i++);
    test.push('tile-' + Math.floor(j / this.cols) + ':' + j % this.cols);
    return test;
  }

  async dijkstra(graph: number[][], delay: number) {
    // console.log(this.finished)
    const src = (parseInt(this.startTile.row, 10) * this.cols) + (parseInt(this.startTile.col, 10));
    const target = (parseInt(this.endTile.row, 10) * this.cols) + (parseInt(this.endTile.col, 10));
    const dist = new Array(this.numTiles);
    const sptSet = new Array(this.numTiles);
    const p = new Array(this.numTiles);

    // console.log('inside dijkstra');
    for (let i = 0; i < this.numTiles; i++) {
      p[src] = -1;
      dist[i] = Number.MAX_VALUE;
      sptSet[i] = false;
    }

    dist[src] = 1;

    for (let i = 0; i < this.numTiles - 1; i++){
      if (!this.inProgress){
        return;
      }

      const u = this.minDistance(dist, sptSet);
      if (u === -1){
        this.finished = true;
        this.inProgress = false;
        this.noPath = true;
        return;
      }
      sptSet[u] = true;

      if (delay > 0){
        await this.wait(delay);
      }
      if (this.tiles[Math.floor(u / this.cols)][u % this.cols].type !== 'start' &&
        this.tiles[Math.floor(u / this.cols)][u % this.cols].type !== 'end' &&
        this.tiles[Math.floor(u / this.cols)][u % this.cols].type !== 'wall'){
        document.getElementById('tile-' + Math.floor(u / this.cols) + ':' + u % this.cols).classList.remove('blank');
        document.getElementById('tile-' + Math.floor(u / this.cols) + ':' + u % this.cols).classList.add('searched');
        document.getElementById('tile-' + Math.floor(u / this.cols) + ':' + u % this.cols).style.animation = '';
        if (delay === 0){

          document.getElementById('tile-' + Math.floor(u / this.cols) + ':' + u % this.cols).style.animation = 'none';
        }
      }
      for (let v = 0; v < this.numTiles; v++)
      {
        if (!sptSet[v] && graph[u][v] !== 0 &&
          dist[u] !== Number.MAX_VALUE &&
          dist[u] + graph[u][v] < dist[v])
        {
          p[v] = u;
          dist[v] = dist[u] + graph[u][v];
        }
      }
      if (u === target){
        break;
      }
    }
    // console.log('found path');

    const array = this.createPathList(p, target, [], 0);
    for (let i = 0; i < array.length - 1; i++) {
      if (delay > 0) {
        await this.wait(50);
      }
      this.lines.push(this.connect(array[i], array[i + 1]));
    }
    // console.log('finished drawing');
    this.inProgress = false;
    this.finished = true;
    // Print the constructed distance array
  }
  wait(time: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, time);
    });
  }

  diagonalChange(): void {
    this.setGraph();
    this.printMatrix()
    if (this.finished){
      this.visualize(0);
    }
    else {
      this.resetLine();
    }
  }

  changeSpeed(e: MatButtonToggleChange) {
    this.delay = parseInt(e.value, 10);
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
    this.inProgress = false;
    this.noPath = true;
  }
}
