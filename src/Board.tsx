import { CLJ } from './Clojure'
import { Move } from './Move';
import { Black, Piece, White, Team, pieceValue, positionBonus } from './Piece';


export type Cell = {
  row: number | null;
  col: number | null;
  origin: string | false | null;
  availableTo: Set<Piece>;
  piece: Piece | null;
};

export class Board {
  private grid: Cell[][];

  public reindex() {
    for (let i = 0; i < this.grid.length; i++) {
      this[i] = this.grid[i];
    }
  }

  constructor() {
    let res: any[][] = [
      [
        { row: 0, col: 0, piece: { color: Black, role: 'castle' } },
        { row: 0, col: 1, piece: { color: Black, role: 'rook' } },
        { row: 0, col: 2, piece: { color: Black, role: 'bishop' } },
        { row: 0, col: 3, piece: { color: Black, role: 'queen' } },
        { row: 0, col: 4, piece: { color: Black, role: 'king' } },
        { row: 0, col: 5, piece: { color: Black, role: 'bishop' } },
        { row: 0, col: 6, piece: { color: Black, role: 'rook' } },
        { row: 0, col: 7, piece: { color: Black, role: 'castle' } }
      ],
      CLJ.range(8).map((idx: number) => { return { row: 1, col: idx, piece: { color: Black, role: 'pawn' } } }),
      CLJ.range(8).map((idx: number) => { return { row: 2, col: idx } }),
      CLJ.range(8).map((idx: number) => { return { row: 3, col: idx } }),
      CLJ.range(8).map((idx: number) => { return { row: 4, col: idx } }),
      CLJ.range(8).map((idx: number) => { return { row: 5, col: idx } }),
      CLJ.range(8).map((idx: number) => { return { row: 6, col: idx, piece: { color: White, role: 'pawn' } } }),
      [
        { row: 7, col: 0, piece: { color: White, role: 'castle' } },
        { row: 7, col: 1, piece: { color: White, role: 'rook' } },
        { row: 7, col: 2, piece: { color: White, role: 'bishop' } },
        { row: 7, col: 3, piece: { color: White, role: 'queen' } },
        { row: 7, col: 4, piece: { color: White, role: 'king' } },
        { row: 7, col: 5, piece: { color: White, role: 'bishop' } },
        { row: 7, col: 6, piece: { color: White, role: 'rook' } },
        { row: 7, col: 7, piece: { color: White, role: 'castle' } }]
    ];

    res.forEach((rowData, rowIdx) => rowData.forEach((cell: any, colIdx: number) => {
      cell.row = rowIdx
      cell.col = colIdx
      cell.availableTo = new Set()
      cell.origin = false
    }))
    this.grid = res
    this.reindex()
  }

  [row: number]: Cell[];

  public getBoard(): NonNullable<Cell[][]> {
    //if (this.validateCoordinates(x, y)) { return null; }
    return this.grid;
  }

  // Method to get a value at (x, y)
  public get(x: number, y: number): NonNullable<Cell> {
    this.validateCoordinates(x, y)
    return this.grid[x][y];
  }

  // Method to set a value at (x, y)
  public set(x: number, y: number, value: Cell): void {
    if (this.validateCoordinates(x, y)) { return; }
    this.grid[x][y] = value;
  }

  private importGrid(grid: Cell[][]) {
    this.grid = CLJ.deepCopy(grid);
    this.reindex()
  }

  public static createCopy(board: Board): Board {
    let target: Board = new Board()
    target.importGrid(board.getBoard())
    return target
  }

  /**
   * function: applyCastling
   * The only time a king can move more than 1 place at a time is when castling.
   * If given a move, the move displaced the king more than 1 place, we move the
   * castle to the corresponding position to the other side of the king
   * @param board - Updated as a side effect
   * @param move 
   * @returns a boolean indicating if we apply castling, such that it can be undone.
   */
  applyCastling(move: Move): Boolean {
    let row = move.to[0]
    let col = move.to[1]
    let selected = move.from
    let cell: Cell = this[row][col]

    if (this[row][col]!.piece! && cell.piece!.role === 'king' && col - selected[1] > 1) {
      this.get(row, col - 1)!.piece = this.get(row, col + 1)!.piece
      this.get(row, col + 1)!.piece = null
      return true
    } else if (cell.piece! && cell.piece!.role === 'king' && col - selected[1] < -1) {
      this.get(row, col + 1)!.piece = this.get(row, col - 1)!.piece
      this.get(row, col - 1)!.piece = null
      return true
    }
    return false
  }

  /**
   * function: undoCastling
   * The only time a king can move more than 1 place at a time is when castling.
   * If given a move, the applyCastling function displaced the king more than 1 
   * place, we move the castle to the corresponding position to the other side 
   * of the king. This function undoes the move applied by applyCastling
   * @param board - Updated as a side effect
   * @param move 
   * @returns the updated board with a castling move undone
   */
  undoCastling(move: Move) {
    let row = move.to[0]
    let col = move.to[1]
    let selected = move.from
    let cell = this.get(move.from[0], move.from[1])
    if (cell!.piece! &&
      cell!.piece!.role === 'king' &&
      col - move.from[1] > 1) {
      this.get(row, 7)!.piece = this.get(row, 5)!.piece
      this.get(row, 5)!.piece = null

    } else if (cell!.piece! &&
      cell!.piece!.role === 'king' &&
      col - selected[1] < -1) {
      this.get(row, col - 1)!.piece = this.get(row, col + 1)!.piece
      this.get(row, col + 1)!.piece = null
    }
    return this;
  }

  /**
   * Function: makeMove 
   * ------------------
   * @param board Board - 2D array of cells representing a chess board 
   * @param move Move - a map with keys from: [x, y] and to:[x', y']
   * @returns a Board with the move applied to it
   */
  makeMove(move: Move): Board {
    //if (move === undefined || move.to === null) { return newBoard; }
    this.get(move.to[0], move.to[1])!.piece = this.get(move.from[0], move.from[1])!.piece;
    this.applyCastling(move)
    this.get(move.from[0], move.from[1])!.piece = null;
    return this;
  }

  undoMove(move: Move): Board {
    if (move === undefined || move.to === null) { return this; }
    this.get(move.from[0], move.from[1])!.piece = this.get(move.to[0], move.to[1])!.piece;
    this.undoCastling(move)
    this.get(move.to[0], move.to[1])!.piece = move.taken;
    return this;
  }

  /**
   * function: inCheck
   * -----------------
   * @param board 
   * @param team 
   * @returns boolean indicating whether the team is in check.
   */
  inCheck(team: Team): boolean {
    //if (!CLJ.seq(board)) { return false; }
    let res: Piece = CLJ.some(
      (cell: Cell) => cell.availableTo &&
        cell.availableTo.size > 0 &&
        cell.piece?.role === 'king' &&
        cell.piece.color === team &&
        cell.piece,
      CLJ.flatten(this.grid))
    return res !== null
  }

  /**
   * clearOrigin
   * --------------
   * Removes the Origin flag from all cells
   * @param board 
   * @returns a board with no cells marked available
   */
  clearOrigin(): Board {
    this.grid.forEach((rowData) => rowData.forEach((colData: Cell) =>
      colData.origin = false))
    return this;
  }

  /**
   * clearAvailableTo
   * ----------------
   * Empties the availableTo set for every cell on the board
   * @param board 
   * @returns a board with every cell's availableTo set empty
   */
  clearAvailableTo(): Board {
    this.grid.forEach((rowData) => rowData.forEach((colData: Cell) =>
      colData.availableTo.clear()));
    return this;
  }

  /**
   * function: pawnToQueen
   * ---------------------
   * if a pawn reached the far side of the board, it becomes a queen. This 
   * function updates the board by converting pawns in the correct positions
   * to queen pieces.
   * @returns a board with extreme pawns converted to queens
   */
  pawnToQueen(): Board {
    this.grid[0].forEach((cell) => {
      if (cell?.piece?.role === 'pawn') { cell.piece.role = 'queen' }
    })
    this.grid[7].forEach((cell) => {
      if (cell?.piece?.role === 'pawn') { cell.piece.role = 'queen' }
    })
    return this;
  }

  /**
   * Function: evaluateBoard
   * -----------------------
   * @param board Board - 2D array of cells representing a chess board
   * @returns a numeric score of the board
   */
  evaluate(): number {
    let score = 0;
    CLJ.flatten(this.getBoard()).forEach(cell => {
      if (cell!.piece! && cell!.piece!.color) {
        score += pieceValue[cell!.piece!.color + cell!.piece!.role] || 0;
        score += positionBonus[cell!.piece!.color + cell!.piece!.role][cell.row!] || 0;
      }
    });
    return score;
  }

  // Validate coordinates
  private validateCoordinates(x: number, y: number): Boolean {
    if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
      throw CLJ.str([x, y])
    }
    return true
  }
}
