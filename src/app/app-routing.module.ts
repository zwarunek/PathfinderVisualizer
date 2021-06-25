import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SelectBoardTypeComponent} from './select-board-type/select-board-type.component';

const routes: Routes = [
  { path: 'board/:boardType',
    component: HomeComponent,
    data: {
      title: 'Pathfinding Visualizer - %boardtype%',
      description: 'Visualize multiple pathfinding algorithms on a grid',
      keywords: 'path, pathfind, path find, pathfinding, pathfindinder, algorithm, algo, algorithms, visual, visualizer, visualization, ' +
        'wall, dijkstra, dijkstra, dikstra, dikstras, a, astar, a star, a*, a *, grid, search, searching',
      ogUrl: ''
    }
  },
  {path: 'boardtype', component: SelectBoardTypeComponent,
    data: {
      title: 'Pathfinding Visualizer',
      description: 'Visualize multiple pathfinding algorithms. Select grid type to get started',
      keywords: 'path, pathfind, path find, pathfinding, pathfindinder, algorithm, algo, algorithms, visual, visualizer, visualization, ' +
        'wall, dijkstra, dijkstra, dikstra, dikstras, a, astar, a star, a*, a *, grid, search, searching',
      ogUrl: ''
    }},

  {path: '**', redirectTo: 'boardtype'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
