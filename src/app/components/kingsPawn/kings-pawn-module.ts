import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { KingsPawnHomeComponent } from "./home.component";
import { MaterialModule } from "src/app/material/material.module";
import { BreadcrumbModule } from "../breadcrumb/breadcrumb.module";

@NgModule({
  declarations: [
    KingsPawnHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    BreadcrumbModule
  ]
})
export class KingsPawnModule { }
