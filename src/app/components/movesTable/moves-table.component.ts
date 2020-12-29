import { Component, Input, OnInit } from "@angular/core";

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
  @Input() moves = [];

  dataSource = [];

  ngOnInit(): void {
    this.dataSource = this.formatMoves();
  }

  private formatMoves(): Array<MoveObject> {
    const moveArray: Array<MoveObject> = [];
    this.moves.forEach((value, idx) => {
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
