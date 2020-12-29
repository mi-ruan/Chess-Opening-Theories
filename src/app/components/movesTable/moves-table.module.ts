import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MovesTableComponent } from "./moves-table.component";
import { MaterialModule } from "src/app/material/material.module";
import { CdkTableModule } from "@angular/cdk/table";

@NgModule({
  declarations: [
    MovesTableComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    CdkTableModule
  ],
  exports: [
    MovesTableComponent
  ]
})
export class MovesTableModule { }
