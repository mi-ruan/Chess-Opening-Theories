import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ECO, masterList } from "src/resources/master-list";
import { CellInfo } from "../components/board/board.component";

export interface NextMoveInfo {
  name: string;
  moves: string;
  continuations: number;
  eco: ECO;
}

@Injectable({providedIn: "root"})
export class InfoService {
  nextMoves = new BehaviorSubject<Array<NextMoveInfo>>([]);
  currentBoardState!:  Map<string, BehaviorSubject<CellInfo>>;

  updateNextMoves(movesObject: Record<string, Array<ECO>>): void {
    let nextMovesInfo = [];
    Object.values(movesObject).forEach(moves =>{
      const nextMoves = this.getLowestMove(moves);
      nextMovesInfo = nextMovesInfo.concat(nextMoves);
    });
    nextMovesInfo.sort((a,b) => b.continuations - a.continuations);
    this.nextMoves.next(nextMovesInfo);
    this.currentBoardState.get("h3").next({
      coord: "h10",
      currentPiece: undefined,
      nextMoves: []
    })
  }

  private getLowestMove(moves: Array<ECO>): Array<NextMoveInfo> {
    let lowest: number;
    let lowestMoves: Array<ECO>;
    moves.forEach(move => {
      const moveLength = move.moves.split(" ").length;
      if (!lowest) {
        lowest = moveLength;
        lowestMoves = [move];
      } else if (lowest > moveLength) {
        lowest = moveLength;
        lowestMoves = [move];
      } else if (lowest === moveLength) {
        lowestMoves.push(move);
      }
    });
    return lowestMoves.map(moves => ({
      name: moves.name,
      moves: moves.moves,
      continuations: masterList.filter(opening => opening.moves.startsWith(moves.moves.trim())).length,
      eco: moves
    }));
  }

  // need to move notation code here. take in a board state to work with.
  // will need a board service with its own internal board to make move notation
  // should cache results so dont have to repeat process
}
