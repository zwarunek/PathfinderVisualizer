import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { HomeComponent } from './home/home.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import { NoRightClickDirective } from './no-right-click.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {Globals} from './globals';
import {Colors} from './colors';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SelectBoardTypeComponent } from './select-board-type/select-board-type.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {WindowRefService} from './Services/window-ref.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoRightClickDirective,
    SelectBoardTypeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatGridListModule,
    DragDropModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    CdkAccordionModule,
    MatCardModule,
    MatRadioModule
  ],
  providers: [
    Globals,
    WindowRefService,
    Colors
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
