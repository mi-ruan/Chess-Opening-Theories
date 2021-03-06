import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ECO } from "src/resources/master-list";
import { initialMap, Pieces } from "../cell/initial-map";
import { OptionsService } from "../options/options.service";

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
  @Input() opening: ECO | undefined = undefined;
  @Output() outputMoves = new EventEmitter<Array<string>>();
  coordMap: Map<string, BehaviorSubject<CellInfo>> = new Map();
  grid = ["a", "b", "c", "d", "e", "f", "g", "h"].map(r =>
    [8, 7, 6, 5, 4, 3, 2, 1].map(c => {
      this.coordMap.set(r+c, this.makeNewSubject(r+c));
      return this.coordMap.get(r+c);
    })
  );

  private moves = [];

  constructor(private optionsService: OptionsService) {}

  ngOnInit(): void {
    if (this.opening) {
      const listOfMoves = this.opening.moves.trim().split(" ");
      listOfMoves.forEach(moves => this.movePieces(moves));
    }
  }
  
  movePieces(move: string): void {
    const [initialCoord, destinationCoord] = [move.substring(0,2), move.substring(2)];
    // update service with new positions
    this.optionsService.initPos = initialCoord;
    this.optionsService.destPos = destinationCoord;
    
    const initialCoordSubject = this.coordMap.get(initialCoord);
    const destinationCoordSubject = this.coordMap.get(destinationCoord);
    const currentPiece = initialCoordSubject.value.currentPiece;
    const destinationPiece = destinationCoordSubject.value.currentPiece;

    this.movePiecesSubjects(currentPiece, initialCoordSubject, destinationCoordSubject);
    if (this.checkForCastle(currentPiece, initialCoord, destinationCoord)) {
      this.moveCastle(currentPiece, initialCoordSubject, destinationCoordSubject);
      return;
    }
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

  private movePiecesSubjects(currentPiece: Pieces, initSubject: BehaviorSubject<CellInfo>, destSubject: BehaviorSubject<CellInfo>): void {
    initSubject.next({...initSubject.value, currentPiece: undefined});
    destSubject.next({...destSubject.value, currentPiece });
  }

  private checkForCastle(currentPiece: Pieces, initalCoord: string, destinationCoord: string): boolean {
    return (currentPiece === Pieces.WK && initalCoord === "e1" && ((destinationCoord === "g1" && this.coordMap.get("h1").value.currentPiece === Pieces.WR) || (destinationCoord === "c1" && this.coordMap.get("a1").value.currentPiece === Pieces.WR)))
    || (currentPiece === Pieces.BK && initalCoord === "e8" && ((destinationCoord === "g8" && this.coordMap.get("h8").value.currentPiece === Pieces.BR) || (destinationCoord === "c8" && this.coordMap.get("a8").value.currentPiece === Pieces.BR))) 
  }

  private moveCastle(currentPiece: Pieces, initialCoord: BehaviorSubject<CellInfo>, destinationCoord: BehaviorSubject<CellInfo>): void {
    this.movePiecesSubjects(currentPiece, initialCoord, destinationCoord);
    let rookPos, newPos;
    switch(destinationCoord.value.coord) {
      case "c1":
        this.movePiecesSubjects(Pieces.WR, this.coordMap.get("a1"), this.coordMap.get("d1"));
        this.moves.push("O-O-O");
        break;
      case "g1":
        this.movePiecesSubjects(Pieces.WR, this.coordMap.get("h1"), this.coordMap.get("f1"));
        this.moves.push("O-O");
        break;
      case "c8":
        this.movePiecesSubjects(Pieces.BR, this.coordMap.get("a8"), this.coordMap.get("d8"));
        this.moves.push("O-O-O");
        break;
      case "g8":
        this.movePiecesSubjects(Pieces.BR, this.coordMap.get("h8"), this.coordMap.get("f8"));
        this.moves.push("O-O");
        break;             
    }
    this.outputMoves.emit(this.moves);
  }
}
