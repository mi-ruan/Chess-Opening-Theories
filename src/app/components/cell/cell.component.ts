import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CellInfo } from "../board/board.component";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() cellInfo!: Observable<Partial<CellInfo>>;
  piece!: string;

  ngOnInit(): void {
    this.cellInfo.subscribe(info => {

    });
  }
}