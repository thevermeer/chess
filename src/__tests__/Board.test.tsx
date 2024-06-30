
import { Board } from '../Board'
import { Black, White, getOtherTeam } from '../Piece';
import { Move } from '../Move';
import { resolveAllRoles } from '../Rules';

describe('Board', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('should initialize board with correct pieces', () => {
    const initialGrid = board.getBoard();

    // Check top row
    expect(initialGrid[0][0].piece).toEqual({ color: Black, role: 'castle' });
    expect(initialGrid[0][1].piece).toEqual({ color: Black, role: 'rook' });
    // ... repeat for all pieces in the initial setup
  });

  test('should get other team', () => {
    expect(getOtherTeam(Black)).toBe(White);
    expect(getOtherTeam(White)).toBe(Black);
  });

  test('should apply castling correctly', () => {
    let move = new Move([7, 4], [7, 6], { role: 'king', color: White }, null);
    board.makeMove(move);
    expect(board.get(7, 5).piece).toEqual({ role: 'castle', color: White });
    expect(board.get(7, 6).piece).toEqual({ role: 'king', color: White });
    expect(board.get(7, 7).piece).toBeNull();
  });

  test('should not apply castling if invalid', () => {
    let move = new Move([7, 4], [7, 5], { role: 'king', color: White }, null);
    board.makeMove(move);
    expect(board.get(7, 5).piece).toEqual({ role: 'king', color: White });
    expect(board.get(7, 7).piece).toEqual({ role: 'castle', color: White });
  });

  test('should undo castling correctly', () => {
    let move = new Move([7, 4], [7, 6], { role: 'king', color: White }, null);
    board.makeMove(move);
    board.undoMove(move);
    expect(board.get(7, 7).piece).toEqual({ role: 'castle', color: White });
    expect(board.get(7, 4).piece).toEqual({ role: 'king', color: White });
    expect(board.get(7, 5).piece).toBeNull();
  });

  test('should make move correctly', () => {
    let move = new Move([1, 0], [2, 0], { role: 'pawn', color: Black }, null);
    board.makeMove(move);
    expect(board.get(2, 0).piece).toEqual({ role: 'pawn', color: Black });
    expect(board.get(1, 0).piece).toBeNull();
  });

  test('should undo move correctly', () => {
    let move = new Move([1, 0], [2, 0], { role: 'pawn', color: Black }, null);
    board.makeMove(move);
    board.undoMove(move);
    expect(board.get(1, 0).piece).toEqual({ role: 'pawn', color: Black });
    expect(board.get(2, 0).piece).toBeNull();
  });

  test('should identify check correctly', () => {
    board.get(0, 4).piece = { role: 'king', color: White };
    board.get(0, 4).availableTo.add({ role: 'rook', color: Black });
    expect(board.inCheck(White)).toBe(true);
  });

  test('should clear origins correctly', () => {
    board.get(0, 0).origin = 'origin';
    board.clearOrigin();
    expect(board.get(0, 0).origin).toBe(false);
  });

  test('should clear availableTo correctly', () => {
    board.get(0, 0).availableTo.add({ role: 'rook', color: White });
    board.clearAvailableTo();
    expect(board.get(0, 0).availableTo.size).toBe(0);
  });

  test('should convert pawn to queen', () => {
    board.get(0, 0).piece = { role: 'pawn', color: Black };
    board.pawnToQueen();
    expect(board.get(0, 0).piece!.role).toBe('queen');
  });

  test('should evaluate board correctly', () => {
    board.get(0, 4).piece = null
    expect(board.evaluate()).toBeGreaterThan(0);
  });

  test('should throw error for invalid coordinates', () => {
    expect(() => {
      board.get(-1, 0);
    }).toThrow();

    expect(() => {
      board.get(0, 8);
    }).toThrow();

    expect(() => {
      board.get(8, 0);
    }).toThrow();

    expect(() => {
      board.get(0, -1);
    }).toThrow();
  });

  test('should import and export grid correctly', () => {
    const newBoard = new Board();
    newBoard.get(3, 3).piece = { role: 'queen', color: White };

    const copyBoard = Board.createCopy(newBoard);
    expect(copyBoard.get(3, 3).piece!.role).toEqual('queen');
    expect(copyBoard.get(3, 3).piece!.color).toEqual(White);
  });

  test('should handle castling edge cases', () => {
    // King not in correct position
    let move = new Move([7, 3], [7, 5], { role: 'king', color: White }, null);
    board.makeMove(move);
    expect(board.applyCastling(move)).toBe(false);

    // Rook not in correct position
    move = new Move([7, 4], [7, 6], { role: 'king', color: White }, null);
    board.set(7, 7, { row: 7, col: 7, origin: false, availableTo: new Set(), piece: null })
    expect(board.applyCastling(move)).toBe(false);
  });

  test('should handle makeMove with taken pieces correctly', () => {
    let move = new Move([1, 0], [6, 0], { role: 'pawn', color: Black }, { role: 'pawn', color: White });
    board.makeMove(move);
    expect(board.get(6, 0).piece).toEqual({ role: 'pawn', color: Black });
    expect(board.get(1, 0).piece).toBeNull();
  });

  test('should handle undoMove with taken pieces correctly', () => {
    let move = new Move([1, 0], [6, 0], { role: 'pawn', color: Black }, { role: 'pawn', color: White });
    board.makeMove(move);
    board.undoMove(move);
    expect(board.get(1, 0).piece).toEqual({ role: 'pawn', color: Black });
    expect(board.get(6, 0).piece).toEqual({ role: 'pawn', color: White });
  });

  test('should correctly identify inCheck status', () => {
    // Position pieces to put white in check
    board.get(0, 4).piece = { role: 'king', color: Black };
    board.get(1, 4).piece = { role: 'queen', color: White };
    resolveAllRoles(board)
    expect(board.inCheck(Black)).toBe(true);

    // Remove threat
    board.get(1, 4).piece = null;
    resolveAllRoles(board)
    expect(board.get(1, 4).piece).toBe(null)
    expect(board.inCheck(Black)).toBe(false);
  });
});
