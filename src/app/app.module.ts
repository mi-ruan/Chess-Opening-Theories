import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DragDropModule} from "@angular/cdk/drag-drop";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { DefaultRouteReuseStrategy } from "./default-route-reuse-strategy";

import { AppComponent } from "./app.component";
import { SearchComponent } from "./components/search/search.component";
import { MainComponent } from "./components/main/main.component";
import { BoardComponent } from "./components/board/board.component";
import { CellComponent } from "./components/cell/cell.component";
import { OptionsComponent } from "./components/options/options.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { EntryComponent } from "./components/entry/entry.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MovesTableModule } from "./components/movesTable/moves-table.module";
import { InfoComponent } from "./components/info/info.component";
import { PromotionModalComponent } from "./components/board/promotionModal/promotion-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    EntryComponent,
    MainComponent,
    BoardComponent,
    CellComponent,
    OptionsComponent,
    InfoComponent,
    PromotionModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MovesTableModule,
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: DefaultRouteReuseStrategy,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
