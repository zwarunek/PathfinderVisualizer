import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SelectBoardTypeComponent} from './select-board-type/select-board-type.component';

const routes: Routes = [
  {path: 'board/:boardType', component: HomeComponent},
  {path: 'boardtype', component: SelectBoardTypeComponent},

  {path: '**', redirectTo: 'boardtype'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
