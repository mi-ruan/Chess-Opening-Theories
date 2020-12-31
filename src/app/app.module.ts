import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { SearchComponent } from "./components/search/search.component";
import { MainComponent } from "./components/main/main.component";
import { BoardComponent } from "./components/board/board.component";
import { CellComponent } from "./components/cell/cell.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { EntryComponent } from "./components/entry/entry.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbModule } from "./components/breadcrumb/breadcrumb.module";
import { MovesTableModule } from "./components/movesTable/moves-table.module";

import { KingsPawnModule } from "./components/kingsPawn/kings-pawn.module";
import { QueensPawnModule } from "./components/queensPawn/queens-pawn.module";
import { FlankModule } from "./components/flankOpenings/flank.module";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    EntryComponent,
    MainComponent,
    BoardComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
    KingsPawnModule,
    QueensPawnModule,
    FlankModule,
    MovesTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
