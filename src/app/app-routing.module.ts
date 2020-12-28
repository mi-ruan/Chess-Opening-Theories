import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EntryComponent } from "./components/entry/entry.component";
import { KingsPawnHomeComponent } from "./components/kingsPawn/home.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: EntryComponent, data: { breadcrumb: "home" } },
  { path: "e4", component: KingsPawnHomeComponent, data: {breadcrumb: "1. e4"} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }