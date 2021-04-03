import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class MoveTableService {
  moves = new BehaviorSubject<Array<string>>([]);

  updateMoveTable(moves: Array<string>): void {
    this.moves.next(moves);
  }
}
