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
  listOfCoords!: Array<string>;

  private dragCoord: string = undefined;
  private dropCoord: string = undefined;

  constructor(
    private moveService: CurrentMoveService
  ) {}

  ngOnInit(): void {
    this.grid = this.moveService.makeNewGrid();
    this.listOfCoords = this.moveService.listOfCoords;
    if (this.opening) {
      this.moveService.openingMoves = this.opening.moves.trim().split(" ");
      this.moveService.openingMoves.forEach(moves => this.moveService.movePieces(moves));
    }
    this.moveService.getNextMoves();
    this.moveService.getAttackingMoves();
    this.moveService.getAttackingData();
  }
  
  enterPredicate(drag: CdkDrag, drop: CdkDropList): boolean {
    this.dragCoord = drag.data;
    this.dropCoord = drop.id;
    return false;
  }

  drop(): void {
    if (this.dragCoord && this.dropCoord) {
      const nextMove = this.dragCoord + this.dropCoord;
      if (this.moveService.isValidMove(nextMove)) {
        this.moveService.openingMoves.push(nextMove);
        this.moveService.movePieces(nextMove);
        this.moveService.getNextMoves();
        this.moveService.getAttackingMoves();
        this.moveService.getAttackingData();
      }
      this.moveService.clearValidMoves();
    }
    this.dragCoord = undefined;
    this.dropCoord = undefined;
  }
}
