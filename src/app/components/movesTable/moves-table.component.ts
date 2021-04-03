import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { MoveTableService } from "./moves-table.service";

interface MoveObject {
  turn: number;
  white: string;
  black?: string;
}

@Component({
  selector: "app-moves-table",
  templateUrl: "./moves-table.component.html",
  styleUrls: ["./moves-table.component.scss"]
})
export class MovesTableComponent implements OnInit {
  dataSource = [];

  constructor(private moveTable: MoveTableService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(filter((event: NavigationEnd) => event instanceof NavigationEnd)).subscribe(event => {
      if (event.url === "/home") this.moveTable.updateMoveTable([]);
    });
    this.moveTable.moves.subscribe(moves => {
      this.dataSource = this.formatMoves(moves);
    });
  }

  private formatMoves(moves: Array<string>): Array<MoveObject> {
    const moveArray: Array<MoveObject> = [];
    moves.forEach((value, idx) => {
      if (idx % 2 === 0) {
        const moveObject = {turn: (idx / 2) + 1, white: value};
        moveArray.push(moveObject);
      } else {
        moveArray[moveArray.length - 1].black = value;
      }
    });
    return moveArray;
  }
}
