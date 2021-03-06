import { Component } from "@angular/core";

@Component({
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.scss"]
})

export class EntryComponent {
  moves: Array<string> = [];

  handleMoves(moves: Array<string>): void {
    this.moves = moves;
  }
}