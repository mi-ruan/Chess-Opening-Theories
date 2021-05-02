import { Component, OnInit } from "@angular/core";
import { InfoService } from "src/app/services/info.service";

@Component({
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.scss"]
})

export class EntryComponent implements OnInit {
  moves: Array<string> = [];
  title: string = "Chess Opening Theories";

  constructor(private infoService: InfoService) {}

  ngOnInit() {
    this.infoService.currentOpening.subscribe(opening => {
      this.title = opening ? opening : "Chess Opening Theories"
    });
  }

  handleMoves(moves: Array<string>): void {
    this.moves = moves;
  }
}