import {Component, HostListener, OnInit} from '@angular/core';
import {newArray} from '@angular/compiler/src/util';
import { KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';

export interface Tile {
  type: any;
  distance: any;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dragging = false;

  lines: any[] = [];

  startTile: {row: any, col: any};
  endTile: {row: any, col: any};

  cols = 40;
  rows = 15;
  numTiles = this.cols * this.rows;
  colorDefault: any = 'lightblue';
  colorSelected: any = 'darkgray';
  tiles: Tile[][];
  tileDiffer: any;
  tileGraph: number[][];
  LIST_IDS: any[] = [];


  constructor(private differs: KeyValueDiffers) {
    this.tiles = [];
    for (let i = 0; i < this.rows; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.tiles[i][j] = {type: 'default', distance: 1};
      }
    }
    this.tileGraph = [];
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
        if (c > 0){
          this.tileGraph[i - 1][i] = this.tileGraph[i][i - 1] =
            this.tiles[Math.floor((i - 1) / this.cols)][(i - 1) % this.cols].distance *
            this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
        }
        if (r > 0){
          this.tileGraph[i - this.cols][i] = this.tileGraph[i][i - this.cols] =
            this.tiles[Math.floor((i - this.cols) / this.cols)][(i - this.cols) % this.cols].distance *
            this.tiles[Math.floor(i / this.cols)][i % this.rows].distance;
        }
        if (i > this.cols && c > 0){
          this.tileGraph[i - this.cols - 1][i] = this.tileGraph[i][i - this.cols - 1] =
            this.tiles[Math.floor((i - this.cols - 1) / this.cols)][(i - this.cols - 1) % this.cols].distance *
            this.tiles[Math.floor(i / this.cols)][i % this.cols].distance * Math.sqrt(2);
        }
        if (i > this.cols - 1 && c !== this.cols - 1){
          this.tileGraph[i - this.cols + 1][i] = this.tileGraph[i][i - this.cols + 1] =
            this.tiles[Math.floor((i - this.cols + 1) / this.cols)][(i - this.cols + 1) % this.cols].distance *
            this.tiles[Math.floor(i / this.cols)][i % this.cols].distance * Math.sqrt(2);
        }
      }
    }
  }

  ngOnInit() {
    // this.tiles.subscribe(message => {
    //   if (message !== this.myVar) {
    //     this.myVar = message;
    //     this.doSomething();
    //   }
    // });
  }

  switchTile(event: MouseEvent, i: any, j: any): void {
    if (!this.dragging && this.tiles[i][j].type !== 'start' && this.tiles[i][j].type !== 'end') {
      switch (event.buttons) {
        case 1:
          if (event.shiftKey) {
            for (const row of this.tiles) {
              for (const tile of row){
                tile.type = 'selected';
                tile.distance = 0;
              }
            }
          } else {
            this.tiles[i][j].type = 'selected';
            this.tiles[i][j].distance = 0;
          }
          break;
        case 2:
          if (event.shiftKey) {
            for (const row of this.tiles) {
              for (const tile of row){
                tile.type = 'default';
                tile.distance = 1;
              }
            }
          } else {
            this.tiles[i][j].type = 'default';
            this.tiles[i][j].distance = 1;
          }
          break;
      }
    }
  }
  drop(ev: DragEvent): void {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    const prev = ev.dataTransfer.getData('prev');

    if ((ev.target as Element).parentElement.id !== data && (ev.target as Element).id !== data && !(ev.target as Element).id.startsWith('start') && !(ev.target as Element).id.startsWith('end') ) {

      if ((ev.target as Element).id.startsWith('tile')){
        const indices = (ev.target as Element).id.split('-')[1].split(':');
        const tile = this.tiles[indices[0]][indices[1]];
        if (data === 'start'){
          this.startTile = {row: indices[0], col: indices[1]};
        }
        else if (data === 'end'){
          this.endTile = {row: indices[0], col: indices[1]};
        }
        tile.type = data;
        tile.distance = 1;
      }
      if (prev.startsWith('tile')) {
        const prevIndices = prev.split('-')[1];
        this.tiles[prevIndices.split(':')[0]][prevIndices.split(':')[1]].type = 'default';
      }
      (ev.target as Element).appendChild(document.getElementById(data));
    }
  }

  allowDrop(ev: DragEvent): void {
    ev.preventDefault();
  }

  drag(ev: DragEvent): void {
    ev.dataTransfer.setData('text', (ev.target as Element).id);
    ev.dataTransfer.setData('prev', (ev.target as Element).parentElement.id);
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
  connect(div1, div2, color, thickness): any { // draw a line connecting elements
    div1 = document.getElementById(div1);
    div2 = document.getElementById(div2);
    const off1 = this.getOffset(div1);
    const off2 = this.getOffset(div2);
    // bottom right
    const x1 = (off1.left + off1.width / 2);
    const y1 = (off1.top + off1.height / 2);
    // top right
    const x2 = (off2.left + off2.width / 2);
    const y2 = (off2.top + off2.height / 2);
    // distance
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    return {
      color,
      top: cy + 'px',
      left: cx + 'px',
      width: length + 'px',
      height: thickness + 'px',
      transform: 'rotate(' + angle + 'deg)'
    };

    // document.body.innerHTML += height;
  }
  fillLines(): void {
    this.resetLine();
    this.setGraph();
    this.dijkstra(this.tileGraph);
    // this.lines = [];
    // const tilesHit: any[] = ['tile-0:3', 'tile-0:10', 'tile-4:10', 'tile-14:20'];
    // for (let i = 0; i < tilesHit.length - 1; i++){
    //   this.lines.push(this.connect(tilesHit[i], tilesHit[i + 1], 'yellow', '4'));
    // }
    // let str = '';
    // for (let i = 0; i < this.tileGraph.length; i++){
    //   // for (let j = 0; i < this.tileGraph.length; j++){
    //     str = str + this.tileGraph[i] + '\n';
    //   // }
    // }
    // console.log(str);
  }

  resetLine(): void {
    this.lines = [];
  }
  minDistance(dist: number[], sptSet: boolean[]): any
  {

    // Initialize min value
    let min = Number.MAX_VALUE;
    // tslint:disable-next-line:variable-name
    let min_index = -1;

    for (let v = 0; v < this.numTiles; v++)
    {
      if (sptSet[v] === false && dist[v] <= min)
      {
        min = dist[v];
        min_index = v;
      }
    }
    return min_index;
  }
  createPathList(p: number[], j: number, test: any[], i: number): any
  {
    // Base Case : If j is source
    if (p[j] === - 1) {
      test.push('tile-' + Math.floor(j / this.cols) + ':' + j % this.cols);
      return test;
    }

    test = this.createPathList(p, p[j], test, i++);
    test.push('tile-' + Math.floor(j / this.cols) + ':' + j % this.cols);
    return test;
  }

  dijkstra(graph: number[][]): void
  {
    const src = (parseInt(this.startTile.row, 10) * this.cols) + (parseInt(this.startTile.col, 10));
    const target = (parseInt(this.endTile.row, 10) * this.cols) + (parseInt(this.endTile.col, 10));
    const dist = new Array(this.numTiles);
    const sptSet = new Array(this.numTiles);
    const p = new Array(this.numTiles);

    // Initialize all distances as
    // INFINITE and stpSet[] as false
    for (let i = 0; i < this.numTiles; i++)
    {
      p[src] = -1;
      dist[i] = Number.MAX_VALUE;
      sptSet[i] = false;
    }

    // Distance of source vertex
    // from itself is always 0
    dist[src] = 0;

    // Find shortest path for all vertices
    for (let count = 0; count < this.numTiles - 1; count++)
    {

      // Pick the minimum distance vertex
      // from the set of vertices not yet
      // processed. u is always equal to
      // src in first iteration.
      const u = this.minDistance(dist, sptSet);

      // Mark the picked vertex as processed
      sptSet[u] = true;

      // Update dist value of the adjacent
      // vertices of the picked vertex.
      for (let v = 0; v < this.numTiles; v++)
      {

        // Update dist[v] only if is not in
        // sptSet, there is an edge from u
        // to v, and total weight of path
        // from src to v through u is smaller
        // than current value of dist[v]
        if (!sptSet[v] && graph[u][v] !== 0 &&
          dist[u] !== Number.MAX_VALUE &&
          dist[u] + graph[u][v] < dist[v])
        {
          p[v] = u;
          dist[v] = dist[u] + graph[u][v];
        }
      }
    }
    let str = '';
    for (let i = 0; i < this.tileGraph.length; i++){
      // for (let j = 0; i < this.tileGraph.length; j++){
        str = str + this.tileGraph[i] + '\n';
      // }
    }
    console.log(str);
    // Print the constructed distance array
    const array = this.createPathList(p, target, [], 0);
    // const tilesHit: any[] = ['tile-0:3', 'tile-0:10', 'tile-4:10', 'tile-14:20'];
    console.log(array);
    for (let i = 0; i < array.length - 1; i++){
      this.lines.push(this.connect(array[i], array[i + 1], 'yellow', '4'));
    }
  }
}
