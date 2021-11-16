import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '',
    component: HomeComponent,
    data: {
      title: 'Pathfinding Visualizer',
      description: 'Visualize multiple pathfinding algorithms on a grid',
      keywords: 'path, pathfind, path find, pathfinding, pathfindinder, algorithm, algo, algorithms, visual, visualizer, visualization, ' +
        'wall, dijkstra, dijkstra, dikstra, dikstras, a, astar, a star, a*, a *, grid, search, searching',
      ogUrl: ''
    }
  },

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
