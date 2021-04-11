import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { Injectable } from "@angular/core";
import { CurrentMoveService } from "../board/current-move.service";

@Injectable({providedIn: "root"})
export class DragDropService {
  private dragCoord: string = undefined;
  private dropCoord: string = undefined;

  constructor(private moveService: CurrentMoveService) {}
  
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
