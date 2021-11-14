import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-board-type',
  templateUrl: './select-board-type.component.html',
  styleUrls: ['./select-board-type.component.scss']
})
export class SelectBoardTypeComponent implements OnInit {

  info = 'Visualize pathfinding algorithms using a square grid. This uses either a 4-connected or 8-connected graph';

  constructor() { }
  ngOnInit(): void {
  }
  clicked(type): void {
    console.log(type);
  }

}
