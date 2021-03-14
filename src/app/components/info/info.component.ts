import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { InfoService, NextMoveInfo } from "src/app/services/info.service";
import { ECO } from "src/resources/master-list";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.scss"]
})
export class InfoComponent implements OnInit {
  // add mat cards of moves: name, list of moves? will need to move stuff in board component to service,
  // list of continuations - again move stuff from board component to a service,
  // order cards by number of continuations
  // clicking on card should navigate to that move

  nextMovesInfo!: Observable<Array<NextMoveInfo>>;

  constructor(private infoService: InfoService, private router: Router) {}

  ngOnInit() {
    this.nextMovesInfo = this.infoService.nextMoves;
  }

  navigateMove(move: ECO): void {
    this.router.navigate(["/main"], { state: {data: move }});
  }
}
