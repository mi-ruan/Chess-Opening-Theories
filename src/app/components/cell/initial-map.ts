export enum Pieces {
  WP = "white-pawn",
  WN = "white-knight",
  WB = "white-bishop",
  WR = "white-rook",
  WQ = "white-queen",
  WK = "white-king",
  BP = "black-pawn",
  BN = "black-knight",
  BB = "black-bishop",
  BR = "black-rook",
  BQ = "black-queen",
  BK = "black-king"
}


export const initialMap = {
  a2: Pieces.WP,
  b2: Pieces.WP,
  c2: Pieces.WP,
  d2: Pieces.WP,
  e2: Pieces.WP,
  f2: Pieces.WP,
  g2: Pieces.WP,
  h2: Pieces.WP,
  a1: Pieces.WR,
  b1: Pieces.WN,
  c1: Pieces.WB,
  d1: Pieces.WQ,
  e1: Pieces.WK,
  f1: Pieces.WB,
  g1: Pieces.WN,
  h1: Pieces.WR,
  a7: Pieces.BP,
  b7: Pieces.BP,
  c7: Pieces.BP,
  d7: Pieces.BP,
  e7: Pieces.BP,
  f7: Pieces.BP,
  g7: Pieces.BP,
  h7: Pieces.BP,
  a8: Pieces.BR,
  b8: Pieces.BN,
  c8: Pieces.BB,
  d8: Pieces.BQ,
  e8: Pieces.BK,
  f8: Pieces.BB,
  g8: Pieces.BN,
  h8: Pieces.BR
}