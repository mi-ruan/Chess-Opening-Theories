import { Component } from "@angular/core";

interface RouteMapping {
  route: string;
  label: string;
}

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class KingsPawnHomeComponent {

  listOfOpenGames: Array<RouteMapping> = [
    {route: "italianGame", label: "Italian Game"},
    {route: "ruyLopez", label: "Ruy Lopez"},
    {route: "twoKnightsDefense", label: "Two Knight's Defense"},
    {route: "threeKnightsGame", label: "Three Knight's Game"},
    {route: "fourKnightsGame", label: "Four Knights Game"},
    {route: "kingsGambit", label: "King's Gambit"},
    {route: "petrovDefense", label: "Petrov Defense"},
    {route: "scotchGame", label: "Scotch Game"},
    {route: "viennaGame", label: "Vienna Game"},
    {route: "philidorDefense", label: "Philidor Defense"},
    {route: "ponzianiOpening", label: "Ponziani Opening"},
    {route: "danishGambit", label: "Danish Gambit"},
    {route: "latvianGambit", label: "Latvian Gambit"},
    {route: "bishopOpening", label: "Bishop's Opening"},
    {route: "centerGame", label: "Center Game"},
    {route: "othersOpenGame", label: "Others"}
  ];
}
