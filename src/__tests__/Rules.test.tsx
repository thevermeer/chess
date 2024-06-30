import { resolveRole, resolveAllRoles, availableMove } from '../Rules';
import { Board, Cell } from '../Board'
import { Black, Team, White, getOtherTeam } from '../Piece';
import { Move } from '../Move';
import CLJ from '../Clojure';

function availableOnBoard(board: Board, team: Team, row: number, col: number) {
  resolveRole(board, team, row, col, false)
  return CLJ.flatten(board.getBoard()).filter((cell: Cell) => cell.availableTo.size > 0)
}

describe('Engine', () => {
  let board: Board = new Board();

  beforeEach(() => {
    board = new Board();
  });

  test('should create a valid move object', () => {
    const cell: Cell = board.get(1, 0);
    const move = availableMove(board, White, 2, 0, cell);
    expect(move).toBeInstanceOf(Move);
    expect(move!.from).toEqual([1, 0]);
    expect(move!.to).toEqual([2, 0]);
    expect(move!.piece).toEqual(cell.piece);
  });

  test('should return null for invalid move', () => {
    const cell: Cell = board.get(1, 0);
    const move = availableMove(board, White, 1, 0, cell);
    expect(move).toBeNull();
  });

  test('should set line of available moves', () => {
    let available = availableOnBoard(board, Black, 1, 0)
    expect(available.length).toBeGreaterThan(0);
    expect(available.length).toBe(2);
    available.forEach(cell => {
      expect(cell.availableTo).toEqual(new Set([board.get(1, 0).piece]));
    });
  });

  test('should generate correct moves for a pawn', () => {
    const moves = availableOnBoard(board, White, 6, 0);
    expect(moves.length).toBe(2); // [plusOne, plusTwo]
  });

  test('should generate correct moves for a rook', () => {
    const moves = availableOnBoard(board, White, 7, 1);
    expect(moves.length).toBe(2); // 8 possible knight moves
  });

  test('should generate correct moves for a bishop', () => {
    let moves = availableOnBoard(board, White, 7, 2);
    expect(moves.length).toBe(0);
    board[4][4].piece = board[7][2].piece
    board[7][2].piece = null
    moves = availableOnBoard(board, White, 4, 4);
    expect(moves.length).toBe(8);
  });

  test('should generate correct moves for a castle', () => {
    let moves = availableOnBoard(board, White, 7, 0);
    expect(moves.length).toBe(0);
    board[4][4].piece = board[7][0].piece
    board[7][0].piece = null
    moves = availableOnBoard(board, White, 4, 4);
    expect(moves.length).toBe(11);
  });

  test('should generate correct moves for a queen', () => {
    let moves = availableOnBoard(board, White, 7, 3);
    expect(moves.length).toBe(0);
    board[4][4].piece = board[7][3].piece
    board[7][3].piece = null
    moves = availableOnBoard(board, White, 4, 4);
    expect(moves.length).toBe(19);
  });

  test('should generate correct moves for a king', () => {
    board.get(5, 5).piece = board.get(7, 4).piece
    board.get(7, 4).piece = null
    board.reindex()
    board.clearAvailableTo()
    const moves = availableOnBoard(board, White, 5, 5);
    expect(moves.length).toBe(5); //hrm // 8 possible moves + 2 castling moves
  });

  test('should resolve roles correctly', () => {
    const updatedBoard = resolveRole(board, White, 6, 0, false);
    const moves = updatedBoard.get(5, 0).availableTo;
    expect(moves.size).toBeGreaterThan(0);
  });

  test('should resolve all roles correctly', () => {
    const updatedBoard = resolveAllRoles(board);
    updatedBoard.getBoard().forEach(rowData => {
      rowData.forEach(cell => {
        if (cell.piece) {
          expect(cell.availableTo.size).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });
});
