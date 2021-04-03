import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ECO, masterList } from "src/resources/master-list";
import { initialMap, Pieces } from "../cell/initial-map";
import { OptionsService } from "../../services/options.service";
import { InfoService } from "src/app/services/info.service";
import { CdkDrag, CdkDragDrop, CdkDropList } from "@angular/cdk/drag-drop";

export interface CellInfo {
  coord: string;
  currentPiece: Pieces | undefined;
  nextMoves: Array<ECO>;
  nextTurn?: "white" | "black";
  totalNextMoves?: number;
  attackingColor?: "white" | "black" | "both";
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
  rowGrid = ["a", "b", "c", "d", "e", "f", "g", "h"];
  grid = this.rowGrid.map(r =>
    [8, 7, 6, 5, 4, 3, 2, 1].map(c => {
      this.coordMap.set(r+c, this.makeNewSubject(r+c));
      return this.coordMap.get(r+c);
    })
    );
  listOfCoords = this.rowGrid.map(r => [8, 7, 6, 5, 4, 3, 2, 1].map(c => r+c)).reduce((a,b) => a.concat(b), []);

  private moves = [];
  private dragCoord: string = undefined;
  private dropCoord: string = undefined;

  constructor(private optionsService: OptionsService, private infoService: InfoService) {}

  ngOnInit(): void {
    if (this.opening) {
      const listOfMoves = this.opening.moves.trim().split(" ");
      listOfMoves.forEach(moves => this.movePieces(moves));
    }
    this.getNextMoves();
    this.getAttackingMoves();
    this.getAttackingData();
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

  enterPredicate(drag: CdkDrag, drop: CdkDropList): boolean {
    this.dragCoord = drag.data;
    this.dropCoord = drop.id;
    return false;
  }

  drop(): void {
    if (this.dragCoord && this.dropCoord) {
      this.movePieces(this.dragCoord + this.dropCoord);
    }
    this.dragCoord = undefined;
    this.dropCoord = undefined;
  }

  private convertCurrentPieceToNotation(piece: Pieces, initialCoord: string, destPiece: Pieces): string {
    const name = piece.split("-")[1];
    const map = {pawn: "", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K"};
    return destPiece ? name === "pawn" ? initialCoord[0]+"x"+map[name] : map[name]+"x" : map[name];
  }

  private makeNewSubject(coord: string): BehaviorSubject<CellInfo> {
    return new BehaviorSubject<CellInfo>({coord, currentPiece: initialMap[coord], nextMoves: []});
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

  private getNextMoves(): void {
    const updateCoordMap: Record<string, Array<ECO>> = {};
    const openingMoves = this.opening?.moves.trim() || "";
    const whoIsTurn = openingMoves === "" ? "white" : openingMoves.split(" ").length % 2 === 0 ? "white" : "black";
    const nextMoves = masterList.filter(opening => opening.moves.startsWith(openingMoves));
    nextMoves.map(opening => {
      const nextMove = opening.moves.replace(openingMoves, "").trim();
      if (nextMove.length > 0) {
        const nextMoveCoord = nextMove.split(" ")[0].substring(2).trim();
        updateCoordMap[nextMoveCoord] ? updateCoordMap[nextMoveCoord].push(opening) : updateCoordMap[nextMoveCoord] = [opening];
      }
    });
    const totalNextMoves = Object.values(updateCoordMap).reduce((a,b) => a + b.length, 0);
    this.infoService.updateNextMoves(updateCoordMap);
    Object.keys(updateCoordMap).forEach(coord => {
      const destSubject = this.coordMap.get(coord);
      destSubject.next({
        ...destSubject.value, 
        ...{ nextMoves: updateCoordMap[coord], nextTurn: whoIsTurn, totalNextMoves }
      })
    })
  }

  private getAttackingMoves(): void {
    this.coordMap.forEach(cellInfo => {
      this.processAttackingMove(cellInfo.getValue());
    })
  }

  private processAttackingMove(cellInfo: CellInfo): void {
    const coord = cellInfo.coord;
    const [row, col] = coord.split("");
    const rowNumber = this.rowGrid.findIndex(i => row === i) + 1;
    const colNumber = parseInt(col);
    if (cellInfo.currentPiece) {
      const [color, piece] = cellInfo.currentPiece.split("-");
  
      if (piece === "pawn") {
        this.processPawnAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if (piece === "knight") {
        this.processKnightAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if(piece === "bishop") {
        this.processBishopAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if (piece === "rook") {
        this.processRookAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if (piece === "queen") {
        this.processQueenAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if (piece === "king") {
        this.processKingAttack(rowNumber, colNumber, color as "white" | "black");
      }
    }
  }

  private processPawnAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    let whiteCol: number | undefined, blackCol: number | undefined;
    const leftAttack: number | undefined = (rowNumber - 1 > 0) ? (rowNumber - 1): undefined;
    const rightAttack: number | undefined = (rowNumber + 1 < 9) ? (rowNumber + 1): undefined;
    if (color === "white") {
      whiteCol = (colNumber + 1 < 9) ? (colNumber + 1) : undefined;
    } else {
      blackCol = (colNumber - 1 > 0) ? (colNumber - 1): undefined;
    }
    if (whiteCol) {
      if (leftAttack) {
        this.setAttackingSquare(leftAttack, whiteCol, color);
      } if (rightAttack) {
        this.setAttackingSquare(rightAttack, whiteCol, color);
      }
    } else if (blackCol) {
      if (leftAttack) {
        this.setAttackingSquare(leftAttack, blackCol, color);
      } if (rightAttack) {
        this.setAttackingSquare(rightAttack, blackCol, color);
      }
    }
  }

  private processKnightAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    // the eight direction knights can attack in 
    const directions = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
    directions.forEach(([row, col]) => {
      const newRow = rowNumber + row;
      const newCol = colNumber + col;
      if (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9) {
        this.setAttackingSquare(newRow, newCol, color);
      }
    });
  }

  private processBishopAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    // the diagonals
    const diags: Array<[number, number]> = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    this.processLineAttack(rowNumber, colNumber, color, diags);
  }

  private processRookAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    // the ranks and files 
    const rows: Array<[number, number]> = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    this.processLineAttack(rowNumber, colNumber, color, rows);
  }

  private processQueenAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    // all eight directions
    const directions: Array<[number, number]> = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    this.processLineAttack(rowNumber, colNumber, color, directions);
  }

  private processLineAttack(rowNumber, colNumber, color: "white" | "black", directions: Array<[number, number]>): void {
    directions.forEach(([row, col]) => {
      let hasFirstOccupiedSquare = false
      let newRow = rowNumber + row;
      let newCol = colNumber + col;
      while (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9 && !hasFirstOccupiedSquare) {
        this.setAttackingSquare(newRow, newCol, color);
        hasFirstOccupiedSquare = this.checkFirstOccupiedSquare(newRow, newCol);
        newRow += row;
        newCol += col;
      }
    });
  }

  private checkFirstOccupiedSquare(rowNumber: number, colNumber: number): boolean {
    const cell = this.coordMap.get(this.rowGrid[rowNumber - 1] + colNumber.toString());
    return cell.getValue().currentPiece !== undefined;
  }

  private processKingAttack(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    // all eight directions
    const directions: Array<[number, number]> = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    directions.forEach(([row, col]) => {
      const newRow = rowNumber + row;
      const newCol = colNumber + col;
      if (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9) {
        this.setAttackingSquare(newRow, newCol, color);
      }
    })
  }

  private setAttackingSquare(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    const cell = this.coordMap.get(this.rowGrid[rowNumber - 1] + colNumber.toString());
    let attackingColor: "white" | "black" | "both" = color;
    if (cell.value.attackingColor !== undefined && cell.value.attackingColor !== attackingColor) attackingColor = "both";
    cell.next({...cell.value, attackingColor});
  }

  private getAttackingData(): void {
    let whiteSpace = 0;
    let blackSpace = 0; 
    let bothSpace = 0;
    this.coordMap.forEach(coord => {
      const attackingColor = coord.getValue().attackingColor;
      switch(attackingColor) {
        case "white":
          whiteSpace++;
          return;
        case "black":
          blackSpace++;
          return;
        case "both":
          bothSpace++;
          whiteSpace++;
          blackSpace++;
          return;
        default: 
        return;
      }
    });
    this.optionsService.whiteOccupiedSpace.next(whiteSpace);
    this.optionsService.blackOccupiedSpace.next(blackSpace);
    this.optionsService.bothOccupiedSpace.next(bothSpace);
  }
}
