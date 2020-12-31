import { Component } from "@angular/core";
import { CellComponent } from "../cell/cell.component";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent {
  grid = ["a", "b", "c", "d", "e", "f", "g", "h"].map(r =>
    [8, 7, 6, 5, 4, 3, 2, 1].map(c => r + c)
  );
}