import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { InfoService } from "src/app/services/info.service";
import { OptionsService } from "src/app/services/options.service";
import { ECO, masterList } from "src/resources/master-list";
import { Pieces, initialMap } from "../cell/initial-map";
import { MoveTableService } from "../movesTable/moves-table.service";

export interface CellInfo {
  coord: string;
  currentPiece: Pieces | undefined;
  nextMoves: Array<ECO>;
  nextTurn?: "white" | "black";
  totalNextMoves?: number;
  attackingColor?: "white" | "black" | "both";
  validMove: boolean;
}

export type Tuple = Array<[number, number]>;

@Injectable({providedIn: "root"})
export class CurrentMoveService {
  rowGrid = ["a", "b", "c", "d", "e", "f", "g", "h"];
  listOfCoords = this.rowGrid.map(r => [8, 7, 6, 5, 4, 3, 2, 1].map(c => r+c)).reduce((a,b) => a.concat(b), []);
  /** raw moves array with init and dest position */
  openingMoves: Array<string> = [];
  clickedCoord: string | undefined;
  private coordMap: Map<string, BehaviorSubject<CellInfo>> = new Map();
  /** notation moves array */
  private noteMoves: Array<string> = [];
  /** list of valid moves based of current piece */
  private listofValidMoves: Array<string> = [];

  constructor(
    private optionsService: OptionsService,
    private moveTable: MoveTableService,
    private infoService: InfoService,
  ) {
    this.makeNewGrid();
  }

  makeNewGrid(): Array<Array<BehaviorSubject<CellInfo>>> {
    this.openingMoves = [];
    this.noteMoves = [];
    return this.rowGrid.map(r =>
      [8, 7, 6, 5, 4, 3, 2, 1].map(c => {
        this.coordMap.set(r+c, this.makeNewSubject(r+c));
        return this.coordMap.get(r+c);
      })
    );
  }

  private makeNewSubject(coord: string): BehaviorSubject<CellInfo> {
    return new BehaviorSubject<CellInfo>({
      coord, 
      currentPiece: initialMap[coord],
      nextMoves: [],
      validMove: false
    });
  }

  checkAndMoveValidMove(coord: string): void {
    if (this.isValidMove(coord)) {
      this.openingMoves.push(coord);
      this.movePieces(coord);
      this.movePiecesAnalysis();
    }
    this.clearValidMoves();
  }

  movePiecesAnalysis(): void {
    this.clearAttackingMoves();
    this.getNextMoves();
    this.getAttackingMoves();
    this.getAttackingData();
  }

  movePieces(move: string): void {
    const [initialCoord, destinationCoord] = [move.substring(0,2), move.substring(2)];
    // update service with new positions
    this.optionsService.initPos.next(initialCoord);
    this.optionsService.destPos.next(destinationCoord);
    
    const initialCoordSubject = this.coordMap.get(initialCoord);
    const destinationCoordSubject = this.coordMap.get(destinationCoord);
    const currentPiece = initialCoordSubject.value.currentPiece;
    const destinationPiece = destinationCoordSubject.value.currentPiece;

    this.movePiecesSubjects(currentPiece, initialCoordSubject, destinationCoordSubject);
    if (this.checkForCastle(currentPiece, initialCoord, destinationCoord)) {
      this.moveCastle(currentPiece, initialCoordSubject, destinationCoordSubject);
      return;
    }
    this.noteMoves.push(this.convertCurrentPieceToNotation(currentPiece, initialCoordSubject.value.coord, destinationPiece)+destinationCoordSubject.value.coord);
    this.moveTable.updateMoveTable(this.noteMoves);
  }

  private movePiecesSubjects(currentPiece: Pieces, initSubject: BehaviorSubject<CellInfo>, destSubject: BehaviorSubject<CellInfo>): void {
    initSubject.next({...initSubject.value, currentPiece: undefined, });
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
        this.noteMoves.push("O-O-O");
        break;
      case "g1":
        this.movePiecesSubjects(Pieces.WR, this.coordMap.get("h1"), this.coordMap.get("f1"));
        this.noteMoves.push("O-O");
        break;
      case "c8":
        this.movePiecesSubjects(Pieces.BR, this.coordMap.get("a8"), this.coordMap.get("d8"));
        this.noteMoves.push("O-O-O");
        break;
      case "g8":
        this.movePiecesSubjects(Pieces.BR, this.coordMap.get("h8"), this.coordMap.get("f8"));
        this.noteMoves.push("O-O");
        break;             
    }
    this.moveTable.updateMoveTable(this.noteMoves);
  }

  private convertCurrentPieceToNotation(piece: Pieces, initialCoord: string, destPiece: Pieces): string {
    const name = piece.split("-")[1];
    const map = {pawn: "", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K"};
    return destPiece ? name === "pawn" ? initialCoord[0]+"x"+map[name] : map[name]+"x" : map[name];
  }

  getNextMoves(): void {
    const updateCoordMap: Record<string, Array<ECO>> = {};
    const openingMoves = this.openingMoves;
    const whoIsTurn = this.getCurrentTurn();
    const nextMoves = masterList.filter(opening => opening.moves.startsWith(openingMoves.join(" ")));
    nextMoves.map(opening => {
      const nextMove = opening.moves.replace(openingMoves.join(" "), "").trim();
      if (nextMove.length > 0) {
        const nextMoveCoord = nextMove.split(" ")[0].substring(2).trim();
        updateCoordMap[nextMoveCoord] ? updateCoordMap[nextMoveCoord].push(opening) : updateCoordMap[nextMoveCoord] = [opening];
      }
    });
    // clear old next moves before updating next moves
    this.coordMap.forEach(coord => coord.next({...coord.value, ...{ nextMoves: [], totalNextMoves: 0 }}));
    const totalNextMoves = Object.values(updateCoordMap).reduce((a,b) => a + b.length, 0);
    this.infoService.updateNextMoves(updateCoordMap);
    Object.keys(updateCoordMap).forEach(coord => {
      const destSubject = this.coordMap.get(coord);
      destSubject.next({
        ...destSubject.value, 
        ...{ nextMoves: updateCoordMap[coord], nextTurn: whoIsTurn, totalNextMoves }
      })
    });
  }

  getCurrentTurn(): "white" | "black" {
    return this.openingMoves.length === 0 ? "white" : this.openingMoves.length % 2 === 0 ? "white" : "black";
  }

  getAttackingMoves(): void {
    this.coordMap.forEach(cellInfo => {
      this.processAttackingMove(cellInfo.getValue());
    })
  }

  clearAttackingMoves(): void {
    this.coordMap.forEach(cellInfo => {
      cellInfo.next({...cellInfo.value, attackingColor: undefined})
    })
  }

  private processAttackingMove(cellInfo: CellInfo): void {
    const coord = cellInfo.coord;
    const [row, col] = coord.split("");
    const rowNumber = this.rowGrid.findIndex(i => row === i) + 1;
    const colNumber = parseInt(col);
    if (cellInfo.currentPiece) {
      const [color, piece] = cellInfo.currentPiece.split("-");
      let attackingSquares: Tuple;
      if (piece === "pawn") {
        attackingSquares = this.processPawnAttack(rowNumber, colNumber, color as "white" | "black");
      }
      else if (piece === "knight") {
        attackingSquares = this.processKnightAttack(rowNumber, colNumber);
      }
      else if(piece === "bishop") {
        attackingSquares = this.processBishopAttack(rowNumber, colNumber);
      }
      else if (piece === "rook") {
        attackingSquares = this.processRookAttack(rowNumber, colNumber);
      }
      else if (piece === "queen") {
        attackingSquares = this.processQueenAttack(rowNumber, colNumber);
      }
      else if (piece === "king") {
        attackingSquares = this.processKingAttack(rowNumber, colNumber);
      }
      attackingSquares.forEach(([row, col]) => this.setAttackingSquare(row, col, color as "white" | "black"));
    }
  }

  private setAttackingSquare(rowNumber: number, colNumber: number, color: "white" | "black"): void {
    const cell = this.coordMap.get(this.rowGrid[rowNumber - 1] + colNumber.toString());
    let attackingColor: "white" | "black" | "both" = color;
    if (cell.value.attackingColor !== undefined && cell.value.attackingColor !== attackingColor) attackingColor = "both";
    cell.next({...cell.value, attackingColor});
  }

  private processPawnAttack(rowNumber: number, colNumber: number, color: "white" | "black"): Tuple {
    const attackingSquares: Tuple = [];
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
        attackingSquares.push([leftAttack, whiteCol]);
      } if (rightAttack) {
        attackingSquares.push([rightAttack, whiteCol]);
      }
    } else if (blackCol) {
      if (leftAttack) {
        attackingSquares.push([leftAttack, blackCol]);
      } if (rightAttack) {
        attackingSquares.push([rightAttack, blackCol]);
      }
    }
    return attackingSquares;
  }

  private processKnightAttack(rowNumber: number, colNumber: number): Tuple {
    // the eight direction knights can attack in 
    const directions = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
    const attackingSquares: Tuple = [];
    directions.forEach(([row, col]) => {
      const newRow = rowNumber + row;
      const newCol = colNumber + col;
      if (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9) {
        attackingSquares.push([newRow, newCol]);
      }
    });
    return attackingSquares;
  }

  private processBishopAttack(rowNumber: number, colNumber: number): Tuple {
    // the diagonals
    const diags: Tuple = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    return this.processLineAttack(rowNumber, colNumber, diags);
  }

  private processRookAttack(rowNumber: number, colNumber: number): Tuple {
    // the ranks and files 
    const rows: Tuple = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    return this.processLineAttack(rowNumber, colNumber, rows);
  }

  private processQueenAttack(rowNumber: number, colNumber: number): Tuple {
    // all eight directions
    const directions: Tuple = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    return this.processLineAttack(rowNumber, colNumber, directions);
  }

  private processLineAttack(rowNumber, colNumber, directions: Tuple): Tuple {
    const attackingSquares: Tuple = [];
    directions.forEach(([row, col]) => {
      let hasFirstOccupiedSquare = false
      let newRow = rowNumber + row;
      let newCol = colNumber + col;
      while (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9 && !hasFirstOccupiedSquare) {
        attackingSquares.push([newRow, newCol]);
        hasFirstOccupiedSquare = this.checkFirstOccupiedSquare(newRow, newCol);
        newRow += row;
        newCol += col;
      }
    });
    return attackingSquares;
  }

  private checkFirstOccupiedSquare(rowNumber: number, colNumber: number): boolean {
    const cell = this.coordMap.get(this.rowGrid[rowNumber - 1] + colNumber.toString());
    return cell.getValue().currentPiece !== undefined;
  }

  private processKingAttack(rowNumber: number, colNumber: number): Tuple {
    // all eight directions
    const directions: Tuple = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    const attackingSquares: Tuple = [];
    directions.forEach(([row, col]) => {
      const newRow = rowNumber + row;
      const newCol = colNumber + col;
      if (newRow > 0 && newRow < 9 && newCol > 0 && newCol < 9) {
        attackingSquares.push([newRow, newCol]);
      }
    });
    return attackingSquares;
  }

  getAttackingData(): void {
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

  // check dropped coord to valid moves list
  isValidMove(move: string): boolean {
    const destCoord = move.substring(2);
    return this.listofValidMoves.includes(destCoord);
  }

  // get valid moves while dragging
  getValidMoves(coord: string): void {
    this.clickedCoord = coord;
    const whoIsTurn = this.getCurrentTurn();
    let attackingSquares: Tuple;
    const cellInfo = this.coordMap.get(coord).getValue();
    const [color, piece] = cellInfo.currentPiece.split("-");
    // only move pieces that are the same as current color
    if (color !== whoIsTurn) return;
    const [initRow, initCol] = cellInfo.coord.split("");
    const rowNumber = this.rowGrid.findIndex(i => initRow === i) + 1;
    const colNumber = parseInt(initCol);
    if (piece === "knight") {
      attackingSquares = this.processKnightAttack(rowNumber, colNumber);
    } else if (piece === "bishop") {
      attackingSquares = this.processBishopAttack(rowNumber, colNumber);
    } else if (piece === "rook") {
      attackingSquares = this.processRookAttack(rowNumber, colNumber);
    } else if (piece === "queen") {
      attackingSquares = this.processQueenAttack(rowNumber, colNumber);
    } else if (piece === "king") {
      attackingSquares = this.processKingAttack(rowNumber, colNumber);
    } else if (piece === "pawn") {
      attackingSquares = this.processPawnMove(rowNumber, colNumber, color);
    }
    const attackingCoord = attackingSquares
      .map(([row, col]) => this.rowGrid[row - 1] + col.toString())
      .filter(coord => {
      const coordPiece = this.coordMap.get(coord).getValue().currentPiece;
      const coordPieceColor = coordPiece?.split("-")[0];
      // do not move pieces where square is already occupied by the same color
      return coordPieceColor !== whoIsTurn;
    });
    // updating valid moves coord with value
    attackingCoord.forEach(coord => {
      const coordSubject = this.coordMap.get(coord);
      coordSubject.next({...coordSubject.value, validMove: true});
    });
    this.listofValidMoves = attackingCoord;
  }

  // clear valid moves after move has been done
  clearValidMoves(): void {
    this.coordMap.forEach(coord => coord.next({...coord.value, validMove: false}));
    this.listofValidMoves = [];
    this.clickedCoord = undefined;
  }

  private processPawnMove(rowNumber: number, colNumber: number, color: "white" | "black"): Tuple {
    const moveSquares: Tuple = []
    if (color === "white") {
      if (colNumber + 1 < 9 && !this.checkFirstOccupiedSquare(rowNumber, colNumber + 1)) moveSquares.push([rowNumber, colNumber + 1]);
      if (colNumber === 2 && !this.checkFirstOccupiedSquare(rowNumber, colNumber + 2)) moveSquares.push([rowNumber, colNumber + 2]);
    } else if (color === "black") {
      if (colNumber - 1 > 0 && !this.checkFirstOccupiedSquare(rowNumber, colNumber - 1)) moveSquares.push([rowNumber, colNumber - 1]);
      if (colNumber === 7 && !this.checkFirstOccupiedSquare(rowNumber, colNumber - 2)) moveSquares.push([rowNumber, colNumber - 2]);
    }
    let attackingSquares = this.processPawnAttack(rowNumber, colNumber, color);
    attackingSquares = attackingSquares.filter(([row, col]) => {
      const cell = this.coordMap.get(this.rowGrid[row - 1] + col.toString());
      const cellPiece = cell.getValue().currentPiece
      if (!cellPiece) return false;
      return cellPiece.split("-")[0] !== color;
    });
    return moveSquares.concat(attackingSquares);
  }
}
