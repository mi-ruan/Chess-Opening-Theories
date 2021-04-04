import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CellInfo, CurrentMoveService } from "../board/current-move.service";
import { OptionsService } from "../../services/options.service";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() cellInfo!: Observable<CellInfo>;
  piece!: string;
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

  constructor(
    private optionsService: OptionsService,
    private moveService: CurrentMoveService
  ) {}

  ngOnInit(): void {
    this.showCoord = this.optionsService.showCoord;
    this.showPercent = this.optionsService.showPercent;
    this.showSpace = this.optionsService.showSpace;

    this.cellInfo.subscribe(info => {
      this.coord = info.coord;
      this.hasNextMoves = info.nextMoves.length > 0;
      this.nextTurn = info.nextTurn;
      this.getPercentage(info);
      this.attackingColor = info.attackingColor;
      this.isValidMove = info.validMove;
    });

    this.optionsService.initPos.subscribe(init => this.isOldPos = init === this.coord);
    this.optionsService.destPos.subscribe(dest => this.isNewPos = dest === this.coord);
  }

  getValidMoves(): void {
    this.moveService.getValidMoves(this.coord);
  }

  private getPercentage(info: CellInfo): void {
    if (info.totalNextMoves) {
      this.opacity = info.nextMoves.length / info.totalNextMoves * 10;
      this.movePercentage = ((info.nextMoves.length / info.totalNextMoves) * 100).toFixed(2)  + "%"; 
    }
  }
}
