import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EntryComponent } from "./components/entry/entry.component";
import { FlankHomeComponent } from "./components/flankOpenings/home.component";
import { KingsPawnHomeComponent } from "./components/kingsPawn/home.component";
import { ItalianGameComponent } from "./components/kingsPawn/openGames/italianGame/italian-game.component";
import { MainComponent } from "./components/main/main.component";
import { QueensPawnHomeComponent } from "./components/queensPawn/home.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: EntryComponent, data: { breadcrumb: "home" } },
  { path: "main", component: MainComponent },
  { path: "e4", data: {breadcrumb: "1. e4" }, children: [
    {path: "", component: KingsPawnHomeComponent },
    { path: "italianGame", component: ItalianGameComponent, data: {breadcrumb: "Italian Game"} }
  ] },
  { path: "d4", component: QueensPawnHomeComponent, data: { breadcrumb: "1. d4" } },
  { path: "flank", component: FlankHomeComponent, data: { breadcrumb: "flank" } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }