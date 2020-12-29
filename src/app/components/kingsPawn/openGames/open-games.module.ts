import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "src/app/material/material.module";
import { BreadcrumbModule } from "../../breadcrumb/breadcrumb.module";

import { ItalianGameComponent } from "./italianGame/italian-game.component";
import { MovesTableModule } from "../../movesTable/moves-table.module";

@NgModule({
  declarations: [
    ItalianGameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    BreadcrumbModule,
    MovesTableModule
  ]
})
export class OpenGamesModule { }
