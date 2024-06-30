import { CLJ } from './Clojure'
import { resolveRole, historyEntry } from './Rules'
import { Board } from './Board'
import { Move } from './Move';
import { Black,  White, Team } from './Piece';

/**
 * Function: generateMoves
 * -------------------------------
 * @param board Board - 2D array of cells representing a chess board
 * @param team - Team - either black or white
 * @returns an array of potential moves for a team
 */
export function generateMoves(board: Board, team: Team): Move[] {
  let tempBoard: Board = board
  let res = CLJ.keepIndexed((rowData, rowIdx) => {
    return CLJ.keepIndexed((colData, colIdx) => {
      if (colData.piece && colData.piece.color === team) {
        tempBoard.clearAvailableTo()
        resolveRole(tempBoard, team, rowIdx, colIdx, board.inCheck(team))
        let moves = CLJ.keep((cell) => {
          if (cell.availableTo.size > 0) {
            return new Move(
              [rowIdx, colIdx],
              [cell.row, cell.col],
              tempBoard[rowIdx][colIdx].piece!,
              cell.piece
            )
          }
        }, CLJ.flatten(tempBoard.getBoard()));
        return moves
      } else {
        return false
      }
    }, rowData)
  }, tempBoard.getBoard())
  return (CLJ.flatten(res))
}

/**
 * makeHistoryEntry
 * ----------------
 * @param score number value of a board
 * @param moves array of moves taken through a given path
 * @returns a historyEntry object
 */
export function makeHistoryEntry(score: number, moves: Move[]): historyEntry {
  return { score: score, moves: moves }
}

/**
 * Function: minimax
 * -----------------
 * Recursively find the minimum/maximum board score, delving to a given initial depth
 * @param board Board - 2D array of cells representing a chess board
 * @param depth Number - The number of moves to perform in the lookahead for a given board
 * @param alpha Number - local maximum score
 * @param beta Number - local minimum score
 * @param maximizingPlayer - Boolean - If true, we maximize for white, if false we minimize for black
 * @param moveHistory - Move[] - accumulator of the moves taken over a path
 * @returns a map with keys:
 * - moves - Move[] - an array move moves of the preferred path
 * - score - number - derived board score from path
 */
export function minimax(board: Board, depth: number, alpha: number, beta: number, maximizingPlayer: boolean, moveHistory: (Move)[]): historyEntry {
  if (depth === 0) {
    return CLJ.threadFirst(
      board.evaluate(),
      [makeHistoryEntry, moveHistory]
    );
  }
  const team: Team = maximizingPlayer ? White : Black;
  const moves: Move[] = generateMoves(board, team);
  let result: historyEntry = { moves: [], score: 0 }
  let val: number = maximizingPlayer ? -Infinity : Infinity

  for (const move of moves) {
    const newBoard: Board = Board.createCopy(board);
    newBoard.makeMove(move);
    result = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer, [...moveHistory, move])
    if (maximizingPlayer) {
      val = Math.max(val, result.score);
      alpha = Math.max(alpha, result.score);
    } else {
      val = Math.min(val, result.score);
      beta = Math.min(beta, result.score);
    }
    if (beta <= alpha) { break; }
  }
  return makeHistoryEntry(val, [...result.moves]);
}

/**
 * function: findBestMove
 * ----------------------
 * @param board Board - 2D array of cells representing a chess board
 * @param team - Team - either black or white
 * @param depth - number - the number of lookahead moves to perform
 * @returns a map with keys { board: Board, move: Move }
 */
export function findBestMove(board: Board, team: Team, depth: number): { board: Board, move: Move } {
  let inTime = Date.now()
  let bestValue = team === White ? -Infinity : Infinity;
  let tempBoard: Board = Board.createCopy(board)
  const moves = generateMoves(tempBoard, team);
  let bestMove: Move = moves[0];
  let boardState: Move[] = [];
  for (const move of moves) {
    const newBoard = Board.createCopy(tempBoard);
    newBoard.makeMove(move)
    if (!newBoard.inCheck(team)) {
      const result = minimax(newBoard, depth - 1, -Infinity, Infinity, team !== White, [move])
      const boardValue = result.score;
      if ((boardValue >= bestValue && team === White) || (boardValue <= bestValue && team === Black)) {
        bestValue = boardValue;
        bestMove = move;
        boardState = result.moves
      }
    }
  }
  console.log("Chosen Board State", boardState, Date.now() - inTime)
  board.makeMove(bestMove)
  board.clearAvailableTo()
  return {
    board: tempBoard,
    move: bestMove
  };
}


