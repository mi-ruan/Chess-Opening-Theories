import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ECO } from "src/resources/master-list";
import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { CurrentMoveService, CellInfo } from "./current-move.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  @Input() opening: ECO | undefined = undefined;
  grid!: Array<Array<BehaviorSubject<CellInfo>>>;

  constructor(
    private moveService: CurrentMoveService
  ) {}

  ngOnInit(): void {
    this.grid = this.moveService.makeNewGrid();
    if (this.opening) {
      this.moveService.openingMoves = this.opening.moves.trim().split(" ");
      this.moveService.openingMoves.forEach(moves => this.moveService.movePieces(moves));
    }
    this.moveService.movePiecesAnalysis();
  }
}
