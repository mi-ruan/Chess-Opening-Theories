import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { BreadcrumbComponent } from "./breadcrumb.component";

@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  exports: [
    BreadcrumbComponent
  ]
})
export class BreadcrumbModule { }
