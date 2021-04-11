import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CellInfo, CurrentMoveService } from "../board/current-move.service";
import { OptionsService } from "../../services/options.service";
import { DragDropService } from "./drag-drop.service";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() cellInfo!: Observable<CellInfo>;
  piece: string | undefined;
  showCoord!: Observable<boolean>;
  showPercent!: Observable<boolean>;
  showSpace!: Observable<boolean>;
  coord!: string;
  isOldPos = false;
  isNewPos = false;
  hasNextMoves = false;
  movePercentage!: string;
  opacity!: number;
  nextTurn!: "white" | "black" | undefined;
  attackingColor!: "white" | "black" | "both";
  isValidMove = false;
  listOfCoords!: Array<string>;

  private clicked = false;

  constructor(
    public dragDropService: DragDropService,
    private optionsService: OptionsService,
    private moveService: CurrentMoveService
  ) {}

  ngOnInit(): void {
    this.showCoord = this.optionsService.showCoord;
    this.showPercent = this.optionsService.showPercent;
    this.showSpace = this.optionsService.showSpace;

    this.listOfCoords = this.moveService.listOfCoords;

    this.cellInfo.subscribe(info => {
      this.coord = info.coord;
      this.hasNextMoves = info.nextMoves.length > 0;
      this.nextTurn = info.nextTurn;
      this.getPercentage(info);
      this.attackingColor = info.attackingColor;
      this.isValidMove = info.validMove;
      this.piece = info.currentPiece;
    });

    this.optionsService.initPos.subscribe(init => this.isOldPos = init === this.coord);
    this.optionsService.destPos.subscribe(dest => this.isNewPos = dest === this.coord);
  }

  getValidMoves(): void {
    if (this.piece) this.moveService.getValidMoves(this.coord);
  }

  isDisabled(): boolean {
    return !this.piece || this.moveService.getCurrentTurn() !== this.piece?.split("-")[0];
  }

  handleClick(): void {
    if (this.isValidMove && this.moveService.clickedCoord) {
      const nextMove = this.moveService.clickedCoord + this.coord;
      if (this.moveService.isValidMove(nextMove)) {
        this.moveService.openingMoves.push(nextMove);
        this.moveService.movePieces(nextMove);
        this.moveService.getNextMoves();
        this.moveService.getAttackingMoves();
        this.moveService.getAttackingData();
      }
      this.moveService.clearValidMoves();
      this.clicked = false;
    } else {
      this.clicked ? this.moveService.clearValidMoves() : this.getValidMoves();
      this.clicked = !this.clicked;
    }
  }

  private getPercentage(info: CellInfo): void {
    if (info.totalNextMoves) {
      this.opacity = info.nextMoves.length / info.totalNextMoves * 10;
      this.movePercentage = ((info.nextMoves.length / info.totalNextMoves) * 100).toFixed(2)  + "%"; 
    }
  }
}
