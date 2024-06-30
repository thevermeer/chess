import { CLJ } from './Clojure'
import { Board, Cell } from './Board'
import { Move } from './Move';
import { Team, White, getOtherTeam } from './Piece';

export type historyEntry = {
  score: number,
  moves: Move[]
}

/**
 * function : availableMove
 * -----------------------
 * @param board 
 * @param team 
 * @param row 
 * @param col 
 * @param cell - the cell containing the piece that the given [row, col] is available to
 * @returns a Move object representing a piece moving from cell to [row, col]
 */
export function availableMove(board: Board, team: Team, row: number, col: number, cell: Cell): Move | null {
  if (
    row > 7 || row < 0 || col > 7 || col < 0 || (row === cell.row && col === cell.col) ||
    (board[row][col]!.piece && board[row][col]!.piece!.color === team)
  ) {
    return null;
  }
  return new Move([cell.row!, cell.col!], [row, col], cell.piece!, board[row][col].piece)
}

function plus(a: number, b: number) { return a + b; }
function minus(a: number, b: number) { return a - b; }
function identity(a: number, b: number) { return a; }

/**
 * setLine
 * -------------------
 * Updates a board to set availability in a line that ends in a board edge or
 * an opponent's piece
 * @param board Board State as a collection of arrays of cells
 * @param team Team - black or white
 * @param rowOperator function returning an integer that is used to traverse
 * a line on the row. Use plus to move right, minus to move left, and identity
 * to remain on the same row for horizontal movement 
 * @param colOperator function returning an integer that is used to traverse
 * a line on the column. Use plus to move down, minus to move up, and identity
 * to remain on the same column for vertical movement 
 * @returns an array of linear moves
 */
function setLine(board: Board, team: Team, row: number, col: number, rowOperator: Function, colOperator: Function): Move[] {
  let i = 1
  let move: Move | null = availableMove(board, team, rowOperator(row, i), colOperator(col, i), board[row][col])
  let collector: Move[] = [move!]
  while (move
    &&
    (!board[rowOperator(row, i)][colOperator(col, i)]!.piece! ||
      board[rowOperator(row, i)][colOperator(col, i)]!.piece!.color === null ||
      board[rowOperator(row, i)][colOperator(col, i)]!.piece!.color === undefined)) {
    i++;
    move = availableMove(board, team, rowOperator(row, i), colOperator(col, i), board[row][col])
    collector.push(move!)
  }
  return collector
}

// Pieces
function pawnFn(board: Board, team: Team, row: number, col: number): (Move | false | null)[] {
  try {
    const direction = team === White ? -1 : 1;

  const plusOne = (row + direction >= 0 &&
    row + direction < 8 &&
    board.get(row + direction, col)! &&
    CLJ.seq(board.get(row + direction, col)!.piece!) === null) &&
    availableMove(board, team, row + direction, col, board[row][col]);

  const plusTwo = (row + direction * 2 >= 0 &&
    row + direction * 2 < 8 &&
    CLJ.seq(board[row + direction * 2][col]!.piece) === null &&
    ((direction === 1 && row === 1) || (direction === -1 && row === 6))) &&
    availableMove(board, team, row + direction * 2, col, board[row][col]);

  const strikeRight = (row + direction >= 0 &&
    row + direction < 8 &&
    board[row + direction][col + 1]! &&
    board[row + direction][col + 1]!.piece &&
    board[row + direction][col + 1]!.piece!.color === getOtherTeam(team)) &&
    availableMove(board, team, row + direction, col + 1, board[row][col])

  const strikeLeft = (row + direction >= 0 &&
    row + direction < 8 &&
    board[row + direction][col - 1]! &&
    board[row + direction][col - 1]!.piece &&
    board[row + direction][col - 1]!.piece!.color === getOtherTeam(team)) &&
    availableMove(board, team, row + direction, col - 1, board[row][col])

  return [plusOne, plusTwo, strikeRight, strikeLeft]} 
  catch(e:any){ throw e } 
}

function rookFn(board: Board, team: Team, row: number, col: number): Move[] {
  return [
    availableMove(board, team, row + 2, col + 1, board[row][col])!,
    availableMove(board, team, row + 2, col - 1, board[row][col])!,
    availableMove(board, team, row - 2, col + 1, board[row][col])!,
    availableMove(board, team, row - 2, col - 1, board[row][col])!,
    availableMove(board, team, row + 1, col + 2, board[row][col])!,
    availableMove(board, team, row + 1, col - 2, board[row][col])!,
    availableMove(board, team, row - 1, col + 2, board[row][col])!,
    availableMove(board, team, row - 1, col - 2, board[row][col])!
  ]
}

function bishopFn(board: Board, team: Team, row: number, col: number): Move[] {
  return [
    ...setLine(board, team, row, col, plus, plus),
    ...setLine(board, team, row, col, plus, minus),
    ...setLine(board, team, row, col, minus, plus),
    ...setLine(board, team, row, col, minus, minus)
  ]
}

function castleFn(board: Board, team: Team, row: number, col: number): Move[] {
  return [
    ...setLine(board, team, row, col, identity, plus),
    ...setLine(board, team, row, col, identity, minus),
    ...setLine(board, team, row, col, plus, identity),
    ...setLine(board, team, row, col, minus, identity)
  ]
}

function queenFn(board: Board, team: Team, row: number, col: number): Move[] {
  return [
    ...bishopFn(board, team, row, col),
    ...castleFn(board, team, row, col)
  ]
}

function kingFn(board: Board, team: Team, row: number, col: number): (Move | null)[] {
  let baseRow = team === White ? 7 : 0
  let castleRight: Move | null = null
  let castleLeft: Move | null = null
  if (row === baseRow && col === 4 &&
    !board.inCheck(team) &&
    (board[baseRow][5].piece! === undefined || board[baseRow][5].piece! === null) &&
    (board[baseRow][6].piece! === undefined || board[baseRow][6].piece! === null) &&
    board[baseRow][7].piece &&
    board[baseRow][7].piece!.role === 'castle' &&
    board[baseRow][7].piece?.color === team) {
    castleRight = new Move(
      [row, col!],
      [row, 6],
      board[row][col].piece!,
      null
    )
  }

  if (row === baseRow && col === 4 &&
    !board.inCheck(team) &&
    (board[baseRow][3].piece! === undefined || board[baseRow][3].piece! === null) &&
    (board[baseRow][2].piece! === undefined || board[baseRow][2].piece! === null) &&
    (board[baseRow][1].piece! === undefined || board[baseRow][1].piece! === null) &&
    board[baseRow][0].piece &&
    board[baseRow][0].piece!.role === 'castle' &&
    board[baseRow][0].piece?.color === team) {
    castleLeft = new Move(
      [row, col!],
      [row, 1],
      board[row][col].piece!,
      null
    )
  }

  return [
    availableMove(board, team, row - 1, col - 1, board[row][col])!,
    availableMove(board, team, row - 1, col, board[row][col])!,
    availableMove(board, team, row - 1, col + 1, board[row][col])!,
    availableMove(board, team, row, col - 1, board[row][col])!,
    availableMove(board, team, row, col + 1, board[row][col])!,
    availableMove(board, team, row + 1, col - 1, board[row][col])!,
    availableMove(board, team, row + 1, col, board[row][col])!,
    availableMove(board, team, row + 1, col + 1, board[row][col])!,
    castleRight,
    castleLeft
  ]
}

/**
 * resolver 
 * -------------
 * Hashmap where the keys represent piece roles and the values
 * are the resolver function for the corresponding piece.
 */
const resolver: Record<any, Function> = {
  pawn: pawnFn,
  rook: rookFn,
  bishop: bishopFn,
  castle: castleFn,
  queen: queenFn,
  king: kingFn
};

/**
* function: attackingKing
* -----------------------
* Predicate function to determine if a team's king is under attack
* @param board 
* @param team 
* @returns a collection of moves that are attacking the team's king
*/
function attackingKing(board: Board, team: Team): Move[] {
  return CLJ.flatten(board.getBoard().map((rowData, row) => {
    return rowData.map((cell, col) => {
      return (cell.piece) && resolver[board![row]![col]!.piece!.role!](board, cell.piece.color, row, col)
    })
  }))
    .filter((m: Move) => m)
    .filter((move: Move) => {
      return board[move.to[0]][move.to[1]].piece! &&
        board[move.to[0]][move.to[1]].piece!.role === 'king' &&
        board[move.to[0]][move.to[1]].piece!.color === team
    })
}

/**
 * resolveRole
 * -----------
 * Given a position on the board, find the piece, and from that piece, mark all
 * cells that the piece can go to with the available property.
 * Internally, this function will verify that each available move is a legal move.
 * That is, we perform a look-ahead for each move to ensure that the given team
 * is not in check after the move.
 * @param board 
 * @param team 
 * @param row 
 * @param col 
 * @returns updated Board with the given [row, col] 
 */
export function resolveRole(board: Board, team: Team, row: number, col: number, incheck:boolean): Board {
  if (board[row][col] && board[row][col]!.piece!.role && resolver[board![row]![col]!.piece!.role!]) {
    resolver[board![row]![col]!.piece!.role!](board, team, row, col, incheck)
      .filter((i: any) => i)
      .forEach((item: Move) => {
        board.makeMove(item)
        // Check to see if the team is in check after the move
        if (!CLJ.seq(attackingKing(board, team))) {
          board[item.to[0]][item.to[1]].availableTo.add(item.piece)
        }
        board.undoMove(item)
      })
  }
  return board
}

/**
 * function: resolveAllRoles
 * -------------------------
 * For each cell on the board, sets the availableTo set, meaning that each cell
 * contains a set of all pieces that can claim it.
 * @param board 
 * @param recur 
 * @returns an updated board with each cell's availableTo set enumerated
 */
export function resolveAllRoles(board: Board): Board {
  let incheck = board.inCheck('white') || board.inCheck('black')
  board.clearAvailableTo()
  .getBoard()
  .forEach((rowData, row) => rowData.forEach((cell, col) => { 
    if (cell.piece) { board = resolveRole(board, cell.piece.color, row, col, incheck) } 
  }))
  return board
}

