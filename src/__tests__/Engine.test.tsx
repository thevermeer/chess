import { Board } from '../Board'
import { findBestMove, generateMoves, makeHistoryEntry, minimax } from '../Engine';
import { White, Black } from '../Piece';
import { Move } from '../Move';

describe('Engine', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    test('should generate correct moves for a team', () => {
        const movesWhite = generateMoves(board, White);
        expect(movesWhite.length).toBeGreaterThan(0);
        movesWhite.forEach(move => {
            expect(move.piece.color).toBe(White);
        });

        const movesBlack = generateMoves(board, Black);
        expect(movesBlack.length).toBeGreaterThan(0);
        movesBlack.forEach(move => {
            expect(move.piece.color).toBe(Black);
        });
    });

    test('should create a valid history entry', () => {
        const move1 = new Move([1, 0], [2, 0], { role: 'pawn', color: Black }, null);
        const move2 = new Move([6, 0], [5, 0], { role: 'pawn', color: White }, null);
        const moves = [move1, move2];
        const score = 100;
        const entry = makeHistoryEntry(score, moves);
        expect(entry.score).toBe(score);
        expect(entry.moves).toEqual(moves);
    });

    test('should perform minimax correctly', () => {
        const depth = 2;
        const alpha = -Infinity;
        const beta = Infinity;
        const maximizingPlayer = true;
        const moveHistory: Move[] = [];

        const result = minimax(board, depth, alpha, beta, maximizingPlayer, moveHistory);
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('moves');
    });

    test('should find the best move for a team', () => {
        const depth = 2;

        const { board: newBoard, move: bestMove } = findBestMove(board, White, depth);
        expect(bestMove).toHaveProperty('from');
        expect(bestMove).toHaveProperty('to');
        expect(bestMove).toHaveProperty('piece');
        expect(newBoard).toBeInstanceOf(Board);
    });

    test('should generate moves for pieces correctly', () => {
        const moves = generateMoves(board, White);
        moves.forEach(move => {
            const piece = board.get(move.from[0], move.from[1]).piece;
            expect(piece).toBeDefined();
            expect(piece!.color).toBe(White);
        });
    });

    test('should generate correct moves for black team', () => {
        const moves = generateMoves(board, Black);
        moves.forEach(move => {
            const piece = board.get(move.from[0], move.from[1]).piece;
            expect(piece).toBeDefined();
            expect(piece!.color).toBe(Black);
        });
    });

    test('should return valid history entry', () => {
        const move1 = new Move([1, 0], [2, 0], { role: 'pawn', color: Black }, null);
        const move2 = new Move([6, 0], [5, 0], { role: 'pawn', color: White }, null);
        const history = makeHistoryEntry(10, [move1, move2]);

        expect(history.score).toBe(10);
        expect(history.moves).toEqual([move1, move2]);
    });

    test('should perform minimax correctly and return history entry', () => {
        const depth = 1;
        const alpha = -Infinity;
        const beta = Infinity;
        const maximizingPlayer = true;
        const moveHistory: Move[] = [];

        const result = minimax(board, depth, alpha, beta, maximizingPlayer, moveHistory);
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('moves');
    });

    test('should find the best move correctly', () => {
        const depth = 1;

        const { board: newBoard, move: bestMove } = findBestMove(board, White, depth);
        expect(newBoard).toBeInstanceOf(Board);
        expect(bestMove).toBeInstanceOf(Move);
    });
});
