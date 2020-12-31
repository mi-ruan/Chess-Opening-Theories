import { Component, Input, OnInit } from "@angular/core";
import { initialMap } from "./initial-map";

@Component({
  selector: "app-cell",
  templateUrl: "./cell.component.html",
  styleUrls: ["./cell.component.scss"]
})
export class CellComponent implements OnInit {
  @Input() coordinates!: string;
  @Input() piece!: string;

  ngOnInit():void {
    this.initialPiece();
  }

  private initialPiece(): void {
    if (this.coordinates) {
      if (!this.piece) {
        this.piece = initialMap[this.coordinates];
      }
    }
  }
}