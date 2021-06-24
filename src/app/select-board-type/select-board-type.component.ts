import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-board-type',
  templateUrl: './select-board-type.component.html',
  styleUrls: ['./select-board-type.component.scss']
})
export class SelectBoardTypeComponent implements OnInit {

  constructor() { }
  tiles: any[][];
  rows = 50;
  cols = 50;

  ngOnInit(): void {
    this.tiles = [];
    for (let i = 0; i < this.rows; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.tiles[i][j] = {row: i, col: j};
      }
    }
  }

}
