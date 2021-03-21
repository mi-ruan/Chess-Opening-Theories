import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CellInfo } from "../board/board.component";
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
  isOldPos = false;
  isNewPos = false;
  hasNextMoves = false;
  movePercentage!: string;
  opacity!: number;
  nextTurn!: "white" | "black" | undefined;
  attackingColor!: "white" | "black" | "both";

  constructor(private optionsService: OptionsService) {}

  ngOnInit(): void {
    this.showCoord = this.optionsService.showCoord;
    this.showPercent = this.optionsService.showPercent;
    this.showSpace = this.optionsService.showSpace;

    this.cellInfo.subscribe(info => {
      this.isOldPos = this.optionsService.initPos === info.coord;
      this.isNewPos = this.optionsService.destPos === info.coord;
      this.hasNextMoves = info.nextMoves.length > 0;
      this.nextTurn = info.nextTurn;
      this.getPercentage(info);
      this.attackingColor = info.attackingColor;
    })
  }

  private getPercentage(info: CellInfo): void {
    if (info.totalNextMoves) {
      this.opacity = info.nextMoves.length / info.totalNextMoves * 10;
      this.movePercentage = ((info.nextMoves.length / info.totalNextMoves) * 100).toFixed(2)  + "%"; 
    }
  }

}
