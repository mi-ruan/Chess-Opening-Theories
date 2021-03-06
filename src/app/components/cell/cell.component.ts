import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CellInfo } from "../board/board.component";
import { OptionsService } from "../options/options.service";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() cellInfo!: Observable<Partial<CellInfo>>;
  piece!: string;
  showCoord!: Observable<boolean>;
  isOldPos = false;
  isNewPos = false;

  constructor(private optionsService: OptionsService) {}

  ngOnInit(): void {
    this.showCoord = this.optionsService.showCoord;

    this.cellInfo.subscribe(info => {
      this.isOldPos = this.optionsService.initPos === info.coord;
      this.isNewPos = this.optionsService.destPos === info.coord;
    })
  }
}
