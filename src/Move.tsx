import { Piece, White } from './Piece'

export class Move {
  public from: [number, number] = [-1, -1];
  public to: [number, number] = [-1, -1];
  public piece: Piece = { role: "pawn", color: White };
  public taken: Piece | null = null;

  constructor(from: [number, number], to: [number, number], piece: Piece, taken: Piece | null) {
    this.from = from;
    this.to = to;
    this.taken = taken;
    this.piece = piece;
  }
}