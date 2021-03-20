import { Injectable } from "@angular/core";
import { initialMap, Pieces } from "../cell/initial-map";

@Injectable({providedIn: "root"})
export class MoveNotationService {
  private moveToNotationCache: Record<string, string> = {};
  private coordMap: Map<string, Pieces | undefined> = new Map();

  initMap(): void {
    ["a", "b", "c", "d", "e", "f", "g", "h"].map(r =>
      [8, 7, 6, 5, 4, 3, 2, 1].map(c => {
        this.coordMap.set(r+c, initialMap[r+c]);
      }));
  }

  getMoveNotation(moves: string): string {
    if (this.moveToNotationCache[moves]) return this.moveToNotationCache[moves];
    this.initMap();
    const listOfMoves = moves.trim().split(" ").map(move => this.movePiecesNotation(move));
    this.moveToNotationCache[moves] = this.ordinalifyList(listOfMoves);
    return this.moveToNotationCache[moves];
  }

  movePiecesNotation(move: string): string {
    const [initialCoord, destCoord] = [move.substring(0,2), move.substring(2)];
    const initialPiece = this.coordMap.get(initialCoord);
    const destPiece = this.coordMap.get(destCoord);
    if (this.checkForCastle(initialPiece, initialCoord, destCoord)) {
      return this.moveCastle(initialPiece, initialCoord, destCoord);
    }
    // move piece
    this.movePieces(initialPiece, initialCoord, destCoord);
    return this.convertPieceToNotation(initialPiece, initialCoord, destPiece) + destCoord;
  }

  private movePieces(initialPiece: Pieces, initialCoord: string, destCoord: string): void {
    this.coordMap.set(initialCoord, undefined);
    this.coordMap.set(destCoord, initialPiece);
  }

  private convertPieceToNotation(piece: Pieces, initialCoord: string, destPiece: Pieces): string {
    const name = piece.split("-")[1];
    const map = {pawn: "", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K"};
    return destPiece ? name === "pawn" ? initialCoord[0]+"x"+map[name] : map[name]+"x" : map[name];
  }

  checkForCastle(initialPiece: Pieces, initalCoord: string, destinationCoord: string): boolean {
    return (initialPiece === Pieces.WK && initalCoord === "e1" && ((destinationCoord === "g1" && this.coordMap.get("h1") === Pieces.WR) || (destinationCoord === "c1" && this.coordMap.get("a1") === Pieces.WR)))
    || (initialPiece === Pieces.BK && initalCoord === "e8" && ((destinationCoord === "g8" && this.coordMap.get("h8") === Pieces.BR) || (destinationCoord === "c8" && this.coordMap.get("a8") === Pieces.BR))) 
  }

  moveCastle(initialPiece: Pieces, initialCoord: string, destCoord: string): string {
    this.movePieces(initialPiece, initialCoord, destCoord);
    switch(destCoord) {
      case "c1":
        this.movePieces(Pieces.WR, "a1", "d1");
        return "O-O-O";
      case "g1":
        this.movePieces(Pieces.WR, "h1", "f1");
        return "O-O";
      case "c8":
        this.movePieces(Pieces.BR, "a8", "d8");
        return "O-O-O";
      case "g8":
        this.movePieces(Pieces.BR, "h8", "f8");
        return "O-O";            
    }
  }

  ordinalifyList(moves: Array<string>): string {
    let outputString = "";
    let counter = 1;
    moves.forEach((move, i) => {
      if (i % 2 === 0) {
        outputString += counter + ". " + move;
        counter++;
      } else {
        outputString += " " + move;
        if (i < moves.length - 1) outputString += ", ";
      }
    });
    return outputString;
  }
}
