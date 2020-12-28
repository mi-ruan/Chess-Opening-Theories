import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { SearchComponent } from "./components/search/search.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { EntryComponent } from "./components/entry/entry.component";
import { AppRoutingModule } from "./app-routing.module";
import { KingsPawnModule } from "./components/kingsPawn/kings-pawn-module";
import { BreadcrumbModule } from "./components/breadcrumb/breadcrumb.module";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    BreadcrumbModule,
    KingsPawnModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
