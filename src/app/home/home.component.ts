import {Component, HostListener, OnInit} from '@angular/core';

export interface Tile {
  type: any;
  index: number[];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dragging = false;
  end = 'start';

  x = 40;
  y = 15;
  colorDefault: any = 'lightblue';
  colorSelected: any = 'darkgray';
  tiles: Tile[];
  LIST_IDS: any[] = [];


  constructor() {
    this.tiles = [];
    for (let i = 0; i < this.y; i++) {
      for (let j = 0; j < this.x; j++) {
        this.tiles[i * this.x + j] = {type: 'default', index: [i, j]};
      }
    }
  }

  ngOnInit(): void {

  }
  ngAfterInit(): void {

  }

  switchTile(event: MouseEvent, i: any): void {
    if (!this.dragging && this.tiles[i].type !== 'start') {
      switch (event.which) {
        case 1:
          if (event.shiftKey) {
            for (const tile of this.tiles) {
              tile.type = 'selected';
            }
          } else {
            this.tiles[i].type = 'selected';
          }
          break;
        case 3:
          if (event.shiftKey) {
            for (const tile of this.tiles) {
              tile.type = 'default';
            }
          } else {
            this.tiles[i].type = 'default';
          }
          break;
      }
    }
  }
  drop(ev: DragEvent): void {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    if ((ev.target as Element).parentElement.parentElement.id !== data) {
      (ev.target as Element).appendChild(document.getElementById(data));
      if ((ev.target as Element).id.startsWith('tile')){
        this.tiles[(ev.target as Element).id.split('-')[1]].type = data.split('-')[0];
      }
    }
  }

  allowDrop(ev: DragEvent): void {
    ev.preventDefault();
  }

  drag(ev: DragEvent): void {
    ev.dataTransfer.setData('text', (ev.target as Element).id);
    if ((ev.target as Element).parentElement.id.startsWith('tile')){
      // console.log(this.tiles[(ev.target as Element).parentElement.id.split('-')[1]].type)
      this.tiles[(ev.target as Element).parentElement.id.split('-')[1]].type = 'default';
    }
  }

}
