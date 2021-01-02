import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ECO } from "src/resources/master-list";
import { initialMap, Pieces } from "../cell/initial-map";

export interface CellInfo {
  coord: string;
  currentPiece: Pieces | undefined;
}

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  @Input() opening!: ECO;
  @Output() outputMoves = new EventEmitter<Array<string>>();
  coordMap: Map<string, BehaviorSubject<CellInfo>> = new Map();
  grid = ["a", "b", "c", "d", "e", "f", "g", "h"].map(r =>
    [8, 7, 6, 5, 4, 3, 2, 1].map(c => {
      this.coordMap.set(r+c, this.makeNewSubject(r+c));
      return this.coordMap.get(r+c);
    })
  );

  private moves = [];

  ngOnInit(): void {
    const listOfMoves = this.opening.moves.trim().split(" ");
    listOfMoves.forEach(moves => this.movePieces(moves));
  }
  
  movePieces(move: string): void {
    const [initialCoord, destinationCoord] = [move.substring(0,2), move.substring(2)];
    const initialCoordSubject = this.coordMap.get(initialCoord);
    const destinationCoordSubject = this.coordMap.get(destinationCoord);
    const currentPiece = initialCoordSubject.value.currentPiece;
    const destinationPiece = destinationCoordSubject.value.currentPiece;
    initialCoordSubject.next({...initialCoordSubject.value, currentPiece: undefined});
    destinationCoordSubject.next({...destinationCoordSubject.value, currentPiece});
    this.moves.push(this.convertCurrentPieceToNotation(currentPiece, initialCoordSubject.value.coord, destinationPiece)+destinationCoordSubject.value.coord);
    this.outputMoves.emit(this.moves);
  }

  private convertCurrentPieceToNotation(piece: Pieces, initialCoord: string, destPiece: Pieces): string {
    const name = piece.split("-")[1];
    const map = {pawn: "", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K"};
    return destPiece ? name === "pawn" ? initialCoord[0]+"x"+map[name] : map[name]+"x" : map[name];
  }

  private makeNewSubject(coord: string): BehaviorSubject<CellInfo> {
    return new BehaviorSubject<CellInfo>({coord, currentPiece: initialMap[coord]});
  }
}
