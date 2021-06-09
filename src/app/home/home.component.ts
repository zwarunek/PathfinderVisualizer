import {Component, HostListener, OnInit} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

export interface Tile {
  selected: boolean;
  index: number[];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  x = 40;
  y = 15;
  colorDefault: any = 'lightblue';
  colorSelected: any = 'darkgray';
  tiles: Tile[];

  constructor() {
    this.tiles = [];
    for (let i = 0; i < this.y; i++) {
      for (let j = 0; j < this.x; j++) {
        this.tiles[i * this.x + j] = {selected: false, index: [i, j]};
      }
    }
  }

  ngOnInit(): void {

  }

  mouseDown(event: MouseEvent, i: any): void {
    // console.log(event.which);
    this.switchTile(event.which, i, event.shiftKey);
  }

  mouseEnter(event: MouseEvent, i: any): void {
    // console.log(event);
    this.switchTile(event.which, i, event.shiftKey);
  }

  switchTile(button: any, i: any, shift: boolean): void {
    switch (button){
      case 1:
        if (shift){
          for (const tile of this.tiles) {
            tile.selected = true;
          }
        }
        else {
          this.tiles[i].selected = true;
        }
        break;
      case 3:
        if (shift){
          for (const tile of this.tiles) {
            tile.selected = false;
          }
        }
        else {
          this.tiles[i].selected = false;
        }
        break;
    }
  }
}
