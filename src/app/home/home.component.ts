import {Component, HostListener, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AlgorithmsService} from '../Services/algorithms.service';
import {Globals} from '../globals';
import {BoardsService} from '../Services/boards.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import {GraphUtilsService} from '../Services/graph-utils.service';
import {WindowRefService} from '../Services/window-ref.service';
import {animate, keyframes, query, style, transition, trigger} from '@angular/animations';
import {Colors} from '../colors';
import {isPlatformBrowser} from '@angular/common';
import {global} from '@angular/compiler/src/util';

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
export const searching = keyframes([
    style({
      'background-color': 'yellow',
      offset: 0
    }),
    style({
      'background-color': Colors.background,
      transform:  'scale(.3) translate(-1px, -1px)',
      offset: .02
    }),
    style({
      'background-color': Colors.searchColorDark,
      transform:  'scale(.3) translate(-1px, -1px)',
      offset: .05
    }),
    style({
      transform:  'scale(1) translate(-1px, -1px)',
      'background-color': Colors.searchColor,
      offset: 1
    })
  ]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('gridSquare', [
      transition('blank => wall', [
        animate('0.3s', keyframes([
          style({'z-index': 100,
            transform: 'matrix(.1, 0, 0, .1, 0, 0)',
            'background-color': Colors.wallColor,
            offset: 0}),
          style({'z-index': 100,
            transform: 'matrix(1, 0, 0, 1, 0, 0)',
            'background-color': Colors.wallColor,
            offset: 1})
        ]))
      ]),
      transition('wall => blank', [
        animate('0.3s', keyframes([
          style({
            'z-index': 100,
            transform: 'matrix(1, 0, 0, 1, 0, 0)',
            'background-color': Colors.wallColor,
            offset: 0
          }),
          style({
            'z-index': 100,
            transform: 'matrix(.1, 0, 0, .1, 0, 0)',
            'background-color': Colors.wallColor,
            offset: 1
          })
        ]))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit {

  draggingWall = false;
  draggingBlank = false;
  draggingStart = false;
  draggingEnd = false;
  boards: any[];
  boardLoading = false;
  algorithm = 'Dijkstra\'s Algorithm';

  lines: any[] = [];

  delay: any;
  delaySliderOptions: any[];
  statsSnackbar: MatSnackBarRef<any>;

  startTile: { row: any, col: any };
  endTile: { row: any, col: any };

  cols: number;
  rows: number;
  numTiles: number;
  tiles: Tile[][];
  tileGraph: number[][];
  adjList: any[][] = [];
  diagonal = false;
  // temp: any[][] = [];

// 12x12 12x52
  grid = true;
  selectedBoard: any;
  boardType: any;
  heuristic = 'manhattan';
  heuristics: any[] = [
    {label: 'Manhattan', value: 'manhattan'},
    {label: 'Octile', value: 'octile'},
    {label: 'Euclidean', value: 'euclidean'},
    {label: 'Manhattan Hex', value: 'hex'},
  ];
  sheetOpenPos: number;
  sheetCloseHeight = 82;
  sheetClosed = true;
  prevMove = window.innerHeight - this.sheetCloseHeight;
  sheetStartY;

  constructor(public globals: Globals,
              @Inject(PLATFORM_ID) private platformId: any,
              private windowRef: WindowRefService,
              private algorithms: AlgorithmsService,
              private boardService: BoardsService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private graphUtils: GraphUtilsService) {
    // this.delay = 20;
  }

  ngOnInit(): void {
    this.delaySliderOptions = [
      {
        delay: 0,
        label: 'Instant',
        value: 1
      },
      {
        delay: 1,
        label: 'Fast',
        value: 2
      },
      {
        delay: 20,
        label: 'Normal',
        value: 3
      },
      {
        delay: 50,
        label: 'Slow',
        value: 4
      }
    ];
    this.delay = this.delaySliderOptions[2];
    this.globals.finished = false;
    this.globals.inProgress = false;
    this.globals.pathExists = false;
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('sheet').style.top = window.innerHeight - this.sheetCloseHeight + 'px';
      this.sheetOpenPos = window.innerHeight * .2;

      this.boardType = this.route.snapshot.paramMap.get('boardType');
      const bottomOffset = window.innerWidth > 991 ? 0 : this.sheetCloseHeight;
      if (this.boardType === 'square') {
        this.cols = Math.floor((window.innerWidth - 40) / 26) - (Math.floor((window.innerWidth - 40) / 26) % 2 === 1 ? 0 : 1);
          this.rows = Math.floor((window.innerHeight - bottomOffset - 104) / 26) - (Math.floor((window.innerHeight - bottomOffset - 104) / 26) % 2 === 1 ? 0 : 1);
      } else if (this.boardType === 'hex') {
        this.cols = Math.floor((window.innerWidth - 40) / 29) - (Math.floor((window.innerWidth - 40) / 29) % 2 === 1 ? 0 : 1);
        this.rows = Math.floor((window.innerHeight - this.sheetCloseHeight - 104) / 31) - (Math.floor((window.innerHeight - this.sheetCloseHeight - 104) / 31) % 2 === 1 ? 0 : 1);
      }

      this.numTiles = this.rows * this.cols;

      this.tiles = [];
      for (let i = 0; i < this.rows; i++) {
        this.tiles[i] = [];
        for (let j = 0; j < this.cols; j++) {
          this.tiles[i][j] = {type: 'blank', distance: 1};
        }
      }
      this.startTile = {row: Math.floor(this.rows / 2) - 1, col: Math.floor(this.cols / 6)};
      this.tiles[this.startTile.row][this.startTile.col].type = 'start';
      this.endTile = {row: Math.floor(this.rows / 2) - 1, col: this.cols - Math.floor(this.cols / 6) - 1};
      this.tiles[this.endTile.row][this.endTile.col].type = 'end';
    }
    this.tileGraph = [];
    this.setGraph();
    this.lines = [];

    this.boards = ['Recursive Maze'];
  }

  setGraph(): void {
    for (let i = 0; i < this.numTiles; i++) {
      this.tileGraph[i] = [];
      for (let j = 0; j < this.numTiles; j++) {
        this.tileGraph[i][j] = 0;
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        this.addToGraph(i, c, r);
      }
    }
  }

  removeFromGraph(i: number): void {
    this.tileGraph[i] = new Array(this.numTiles).fill(0);
    for (let row = 0; row < this.tileGraph.length; row++) {
      if (row !== i) {
        this.tileGraph[row][i] = 0;
      }
    }
  }

  addToGraph(i: number, c: number, r: number): void {
    if (c > 0) {
      this.tileGraph[i - 1][i] = this.tileGraph[i][i - 1] =
        this.tiles[Math.floor((i - 1) / this.cols)][(i - 1) % this.cols].distance *
        this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
    }
    if (r > 0) {
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
    if (this.boardType === 'hex') {
      if (i > this.cols && c > 0 && c % 2 !== 1) {
        this.tileGraph[i - this.cols - 1][i] = this.tileGraph[i][i - this.cols - 1] =
          this.tiles[Math.floor((i - this.cols - 1) / this.cols)][(i - this.cols - 1) % this.cols].distance *
          this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
      }
      if (i > this.cols - 1 && c !== this.cols - 1 && c % 2 !== 1) {
        this.tileGraph[i - this.cols + 1][i] = this.tileGraph[i][i - this.cols + 1] =
          this.tiles[Math.floor((i - this.cols + 1) / this.cols)][(i - this.cols + 1) % this.cols].distance *
          this.tiles[Math.floor(i / this.cols)][i % this.cols].distance;
      }
    }
  }

  addEdge(i: number, j: number, distance: number): void {
    this.tileGraph[i][j] = this.tileGraph[j][i] = distance;
  }

  mouseEnter(e: any, row: any, col: any): void {
    if (this.globals.inProgress || (e.type.includes('mouse') && e.sourceCapabilities.firesTouchEvents)) {
      return;
    }
    e.preventDefault();
    if (!(e instanceof TouchEvent)) {
      if (e.buttons === 0) {
        this.draggingStart = this.draggingEnd = this.draggingWall = this.draggingBlank = false;
        return;
      } else if (!this.draggingWall && e.buttons === 1) {
        this.draggingWall = true;
        this.draggingBlank = false;
      } else if (!this.draggingBlank && e.buttons === 2) {
        this.draggingBlank = true;
        this.draggingWall = false;
      }
    }

    if (this.draggingStart && JSON.stringify(this.endTile) !== JSON.stringify({row, col})) {
      this.startTile = {row, col};
      this.setNonWall('start', row, col, false);

    } else if (this.draggingEnd && JSON.stringify(this.startTile) !== JSON.stringify({row, col})) {
      this.endTile = {row, col};
      this.setNonWall('end', row, col, false);

    } else if (this.draggingWall && JSON.stringify(this.startTile) !== JSON.stringify({row, col}) &&
      JSON.stringify(this.endTile) !== JSON.stringify({row, col})) {

      if (this.tiles[row][col].type !== 'wall') {
        this.setWall(row, col, !this.globals.finished);
      }
    } else if (this.draggingBlank && JSON.stringify(this.startTile) !== JSON.stringify({row, col}) &&
      JSON.stringify(this.endTile) !== JSON.stringify({row, col})) {
      if (this.tiles[row][col].type !== 'blank') {
        this.setNonWall('blank', row, col, true);
      }
    }
    if (this.globals.finished) {
      this.visualize(0);
    } else if (!this.globals.finished) {
      this.resetPath();
    }
  }

  mouseDown(e: any, row: any, col: any): void {
    if (this.globals.inProgress || (e.type.includes('mouse') && e.sourceCapabilities.firesTouchEvents)) {
      return;
    }
    e.preventDefault();
    if (JSON.stringify(this.startTile) === JSON.stringify({row, col})) {
      this.draggingStart = true;
    } else if (JSON.stringify(this.endTile) === JSON.stringify({row, col})) {
      this.draggingEnd = true;
    } else if ((e instanceof MouseEvent && e.buttons === 1) || (e instanceof TouchEvent && this.tiles[row][col].type === 'blank')) {
      this.draggingWall = true;
      if (this.tiles[row][col].type !== 'wall') {
        this.setWall(row, col, !this.globals.finished);
      }
    } else if ((e instanceof MouseEvent && e.buttons === 2) || (e instanceof TouchEvent && this.tiles[row][col].type === 'wall')) {
      this.draggingBlank = true;
      if (this.tiles[row][col].type !== 'blank') {
        this.setNonWall('blank', row, col, true);
      }
    }
    if (this.globals.finished) {
      this.visualize(0);
    } else if (!this.globals.finished) {
      this.resetPath();
    }
  }

  mouseLeave(e: any, row: any, col: any): void {
    e.preventDefault();
    if (this.globals.inProgress || (e.type.includes('mouse') && e.sourceCapabilities.firesTouchEvents)) {
      return;
    }
    if ((this.draggingStart && JSON.stringify(this.endTile) !== JSON.stringify({row, col})) ||
      (this.draggingEnd && JSON.stringify(this.startTile) !== JSON.stringify({row, col}))) {
      this.setNonWall('blank', row, col, false);
    }
  }

  mouseUp(): void {
    this.draggingStart = this.draggingEnd = this.draggingWall = this.draggingBlank = false;
  }

  setWall(row, col, animation): void {
    const tile = document.getElementById('tile-' + row + ':' + col);

    if (animation) {
      tile.classList.remove('noTransition');
    } else {
      tile.classList.add('noTransition');
    }
    this.tiles[row][col].type = 'wall';
    this.tiles[row][col].distance = 0;
    this.removeFromGraph(row * this.cols + col);
  }

  setNonWall(type: any, row, col, animation): void {
    this.tiles[row][col].type = type;
    this.tiles[row][col].distance = 1;
    const tile = document.getElementById('tile-' + row + ':' + col);
    if (animation) {
      tile.classList.remove('noTransition');
    } else {
      tile.classList.add('noTransition');
    }
    let neighbors;
    if (this.boardType === 'square') {
      neighbors = this.graphUtils.findNeighborsSquare(row, col, this.rows, this.cols, this.diagonal);
    } else if (this.boardType === 'hex') {
      neighbors = this.graphUtils.findNeighborsHex(row, col, this.rows, this.cols);
    }
    for (const neighbor of neighbors) {
      if (this.tiles[neighbor.row][neighbor.col].distance > 0) {
        this.addEdge(parseInt(row, 10) * this.cols + parseInt(col, 10),
          neighbor.row * this.cols + neighbor.col,
          neighbor.col !== col && neighbor.row !== row && this.boardType === 'square' ? Math.sqrt(2) : 1);
      }
    }
  }

  getOffset(el): any {
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

    return {weight: 1, x1, y1, x2, y2};

  }

  visualize(delay: number): void {
    this.globals.inProgress = true;
    this.resetPath();
    const path = this.algorithms.runPathfindingAlgorithm(this.algorithm, this.tileGraph,
      this.startTile,
      this.endTile,
      this.rows,
      this.cols,
      this.heuristic,
      this.diagonal,
      this.boardType);
    this.globals.pathExists = path.path !== undefined;
    this.displayPath(path, delay).then(() => {
      this.globals.inProgress = false;
      // time = Date.now() - time;
      // this.statsSnackbar = this.snackBar.open('Time: ' + time + 'ms      Path Length: ' + path.path.length
      // + ' Tiles Searched: ' + path.steps.length, 'Dismiss');
    });

  }

  resetPath(): void {
    this.lines = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const tile = document.getElementById('tile-' + i + ':' + j);
        if (this.tiles[i][j].type === 'searched') {
          tile.classList.add('noTransition');
          this.tiles[i][j].type = 'blank';
        }
      }
    }
    this.globals.finished = false;
    this.globals.pathExists = false;
  }

  resetTiles(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.tiles[row][col].type === 'wall') {
          this.setNonWall('blank', row, col, false);
        }
      }
    }
    if (this.globals.finished) {
      this.visualize(0);
    } else if (!this.globals.finished) {
      this.resetPath();
    }
  }

  async displayPath(path: { path, steps }, delay: number): Promise<void> {
    for (const step of path.steps) {
      if (this.globals.inProgress === false) {
        this.globals.pathExists = false;
        return;
      }

      const tile = {row: Math.floor(step / this.cols), col: step % this.cols};
      if (this.tiles[tile.row]  [tile.col].type === 'blank' &&
        JSON.stringify(this.startTile) !== JSON.stringify({row: tile.row, col: tile.col}) &&
        JSON.stringify(this.endTile) !== JSON.stringify({row: tile.row, col: tile.col})) {
        const tileElement = document.getElementById('tile-' + tile.row + ':' + tile.col);
        tileElement.classList.remove('noTransition');
        this.tiles[tile.row][tile.col].type = 'searched';
        if (delay === 0) {
          tileElement.classList.add('noTransition');
        }
        if (delay > 0) {
          await this.sleep(delay);
        }
      }
    }
    if (this.globals.pathExists) {
      for (let i = 0; i < path.path.length - 1; i++) {
        if (delay > 0) {
          await this.sleep(10);
        }
        this.lines.push(this.connect('tile-' + Math.floor(path.path[i] / this.cols) + ':' + path.path[i] % this.cols,
          'tile-' + Math.floor(path.path[i + 1] / this.cols) + ':' + path.path[i + 1] % this.cols));
      }
    }
    this.globals.finished = true;
  }

  sleep(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  diagonalChange(): void {
    this.setGraph();
  }

  changeSpeed(delay: any): void {
    this.delay = this.delaySliderOptions[parseInt(delay, 10)];

  }

  printMatrix(): void {
    let str = '';
    for (const vertex of this.tileGraph) {
      str = str + vertex + '\n';
    }
    console.log(str);
  }

  cancel(): void {
    this.globals.inProgress = false;
  }

  async loadBoard(): Promise<void> {
    this.boardLoading = true;
    this.resetPath();
    this.resetTiles();
    if (this.selectedBoard === undefined) {
      this.resetTiles();
      this.boardLoading = false;
      return;
    }
    const walls = this.boardService.generateBoard(this.selectedBoard, this.rows, this.cols);

    for (const wall of walls) {
      if (JSON.stringify(this.startTile) !== JSON.stringify({row: wall[0], col: wall[1]}) &&
        JSON.stringify(this.endTile) !== JSON.stringify({row: wall[0], col: wall[1]})) {
        this.setWall(wall[0], wall[1], true);
        await this.sleep(1);
      }
    }
    this.boardLoading = false;
  }

  testSheet(e: any): void {
    if ((e instanceof TouchEvent || e.buttons === 1) && !e.target.className.includes('mat-slider')) {
      e.preventDefault();
      const sheet = document.getElementById('sheet');
      const sheetTop = parseInt(sheet.style.top.slice(0, -2), 10);
      sheet.style.transition = 'none';
      if (e instanceof TouchEvent) {
        sheet.style.top = e.touches[0].clientY - this.sheetStartY + 'px';
      } else {
        sheet.style.top = e.clientY - this.sheetStartY + 'px';
      }
      this.prevMove = sheetTop;
    }
  }

  testSheetClick(e): void {
    const sheet = document.getElementById('sheet');
    const sheetTop = parseInt(sheet.style.top.slice(0, -2), 10);
    // send to bottom
    if (sheetTop === window.innerHeight - this.sheetCloseHeight || (
      sheetTop !== this.sheetOpenPos && ((
        sheetTop >= this.prevMove &&
        sheetTop >= this.sheetOpenPos &&
        sheetTop < window.innerHeight - this.sheetCloseHeight
      ) || sheetTop > window.innerHeight - this.sheetCloseHeight))) {
      sheet.style.transition = '.6s cubic-bezier(0.12, 0.35, 0.29, 1.24)';
      sheet.style.top = window.innerHeight - this.sheetCloseHeight + 'px';
      this.prevMove = window.innerHeight - this.sheetCloseHeight;
    } else {
      sheet.style.transition = '.6s cubic-bezier(0.12, 0.35, 0.29, 1.24)';
      sheet.style.top = this.sheetOpenPos + 'px';
      this.prevMove = this.sheetOpenPos;
    }
  }

  touchStart(e: any): void {
    const sheet = document.getElementById('sheet');
    if (e instanceof TouchEvent) {
      this.sheetStartY = e.touches[0].clientY - sheet.offsetTop;
    } else {
      this.sheetStartY = e.clientY - sheet.offsetTop;
    }
    const sheetTop = parseInt(sheet.style.top.slice(0, -2), 10);
    this.sheetClosed = sheetTop !== this.sheetOpenPos;
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.globals.finished) {
      this.visualize(0);
    }
  //   this.cancel();
  //   const sheet = document.getElementById('sheet');
  //   sheet.style.transition = 'none';
  //   this.ngOnInit();
  }
}
