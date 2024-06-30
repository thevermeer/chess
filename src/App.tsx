import { Fragment, HTMLAttributes, MouseEventHandler, useEffect, useState } from 'react';
import { resolveRole, resolveAllRoles } from './Rules';
import { Board, Cell } from './Board'
import { findBestMove } from './Engine';
import { CLJ } from './Clojure'
import { Application, Grid, GridCell } from './Components'
import { Black, Piece, Team, White, getOtherTeam, pieceToChar } from './Piece';
import { Move } from './Move';

interface GridCellProps extends HTMLAttributes<HTMLElement> {
  row: number;
  col: number;
  piece: Piece;
  origin: string | false | null;
  availableTo: Set<Piece>;
  selected: [row: number, col: number, cell: Cell] | null;
}
const ChessSquare = ({ row, col, selected, piece, origin, availableTo, ...rest }: GridCellProps) => {
  return (
    <GridCell
      aria-label={`Cell ${row}.${col}`}
      data-testid={`cell${row}.${col}`}
      {...rest}
      className={
        `${piece && piece.role}
         ${availableTo && selected && CLJ.contains(availableTo, selected![2].piece!) && 'available'}
           ${origin}
           ${piece && piece.color}
           cell
           ${(selected
          && row === selected[0]
          && col === selected[1]
          && 'selected')}`}>
      {piece && piece.role && (<div className='piece'>{pieceToChar[piece.role]}</div>)}
    </GridCell>
  )
}

interface GameStateProps extends HTMLAttributes<HTMLElement> {
  team: Team;
  processing: Boolean;
  board: Board;
  moveHistory: Move[];
  onUndo: MouseEventHandler<HTMLButtonElement>;
  onAutomate: MouseEventHandler<HTMLButtonElement>;
}
const GameState = ({ team, processing, board, moveHistory, onAutomate, onUndo }: GameStateProps) => {
  const [expanded, setExpanded] = useState(false)
  const movesRev = moveHistory.reverse()
  return (
    <>
      <div className="game-state-expand">
        <button onClick={() => { setExpanded(!expanded) }}>☰</button>
      </div>
      <div className={`game-state ${expanded ? "expanded" : ""}`}>
        <div className="game-state-element">
          <h3>{team}'s turn</h3>
          {board.inCheck(team) ? (<><div>IN CHECK</div><div className="checkmark"></div></>) : ''}
        </div>
        <div className="game-state-history">
          <h3>Move History</h3>
          <div className="history-container">
            {movesRev.map((move: Move, idx: number) => {
              const revIdx = moveHistory.length - idx
              return (
                <div key={idx}>
                  {revIdx}. <span className={move.piece.color}>{pieceToChar[move.piece.role]}</span>
                  &nbsp;
                  [{String.fromCharCode(move.from[1] + 65)}, {move.from[0]}]
                  &nbsp;➟&nbsp;
                  [{String.fromCharCode(move.to[1] + 65)}, {move.to[0]}]
                  {move.taken ? (<>
                    &nbsp;➫ <span className={move.taken!.color}>{pieceToChar[move.taken!.role]}</span>
                  </>) : null}
                </div>)
            })}
          </div>
        </div>
        <div className='action-buttons game-state-element'>
          <button onClick={onUndo}>Undo</button>
          <button onClick={onAutomate}>Automate</button>
          <button onClick={() => {
            console.log("here")
            
             CLJ.flatten(board.getBoard()).reduce((sums: number[], next: Cell) => {
              let available = CLJ.seq(next.availableTo)
              const blacks: number = available ? available.filter((cell: Cell) => cell.piece && cell.piece.color === Black).length : 0;
              const whites: number = 0 //CLJ.seq(next.availableTo)!.filter((cell: Cell) => cell.piece && cell.piece.color === White).length
              let result: number[] = [sums[0] + whites, sums[1] + blacks]
              return result
            }, [0, 0])
          }}>
            Remaining
          </button>
        </div>
      </div>
    </>
  )
}

function App() {
  const [board, setBoard] = useState<Board>(new Board())
  const [counter, setCounter] = useState<number>(0)
  const [selected, setSelected] = useState<[row: number, col: number, cell: Cell] | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team>(White);
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [processing, setProcessing] = useState<Boolean>(false)

  const commit = (board: Board, move: Move): void => {
    board.pawnToQueen();
    resolveAllRoles(board);
    setBoard(board)
    setMoveHistory([move, ...moveHistory])
    setActiveTeam(getOtherTeam(activeTeam))
  }

  const handleCellClick = (board: Board, row: number, col: number, cell: Cell): void => {
    if (cell.piece && cell.piece.color! === activeTeam) {
      setSelected([row, col, cell])
      board.clearOrigin()
      setBoard(resolveRole(board, activeTeam, row, col, board.inCheck(activeTeam)))
    } else if (selected! && cell.availableTo.has(selected![2].piece!) && selected && board) {
      let newBoard = board
      const move: Move = new Move(
        [selected[0], selected[1]],
        [row, col],
        newBoard[selected[0]][selected[1]]!.piece!,
        newBoard[row][col]!.piece!
      )
      setSelected(null);
      setCounter(1)
      setProcessing(true);
      newBoard.clearAvailableTo()
      commit(newBoard.makeMove(move), move);
    }
  };

  const handleUndo = () => {
    if (moveHistory.length < 2 || processing) { return; }
    let tempBoard = Board.createCopy(board)
    tempBoard.undoMove(moveHistory[0])
    tempBoard.undoMove(moveHistory[1])
    moveHistory.shift()
    moveHistory.shift()
    setBoard(resolveAllRoles(tempBoard))
    setSelected(null)
  }

  // On Mount
  useEffect(() => {
    setActiveTeam(White);
    setSelected(null);
    resolveAllRoles(board)
  }, []);

  // Handles Move Automation, processing 'counter' number of moves 
  useEffect(() => {
    const automateMove = (board: Board, team: Team): void => {
      let res = findBestMove(board, team, 3);
      if (res.move === undefined) { return; }
      // Mark the automated destination cell
      res.board.makeMove(res.move)
      if (res.board && res.move && res.board[res.move.to[0]][res.move.to[1]]) {
        res.board!.get(res.move.to[0], res.move.to[1])!.origin = "origin"
      }
      // Mark the automated source and destination cells
      setSelected([res.move.from[0], res.move.from[1], board[res.move.to[0]][res.move.to[1]]!])
      // Commit the move
      commit(res.board, res.move);
    }
    // Run the automation on a timeout
    setTimeout(() => {
      if (CLJ.seq(board) && counter > 0) {
        board.clearAvailableTo().clearOrigin()
        automateMove(board, activeTeam)
        setCounter(counter - 1)
        setProcessing(counter - 1 > 0)
      }
    }, 100)
  }, [activeTeam, counter, board])

  return (
    <>
      <Application key="application">
        <Grid>
          <div className="legend" role="gridcell" ></div>
          {board && board.getBoard().map((_, row) => (
            <div key={`header-${row}`} className="legend" role="gridcell">
              {String.fromCharCode(row + 65)}
            </div>))}
          {board && board.getBoard().map((rowData, row) => (
            <Fragment key={`F${row}`}>
              <div className="legend" role="gridcell">{row}</div>
              {rowData.map((cell: Cell, col: number) => (
                <ChessSquare
                  key={`${row}.${col}`}
                  piece={cell.piece!}
                  row={row}
                  col={col}
                  origin={cell.origin}
                  availableTo={cell.availableTo}
                  selected={selected}
                  onClick={() => {
                    setCounter(0)
                    handleCellClick(board, row, col, cell)
                  }}>
                </ChessSquare>))}
            </Fragment>))}
        </Grid>
        <GameState
          team={activeTeam}
          processing={processing}
          board={board}
          moveHistory={moveHistory}
          onUndo={handleUndo}
          onAutomate={() => {
            let val: string | null = prompt("Enter the number of moves to automate", "0")
            if (val) {
              setCounter(parseInt(val))
              setProcessing(true)
            }
          }}>
        </GameState>
      </Application>

      <dialog className='dlg' open={processing ? true : undefined}>
        {'\u{023F3}'}{'\u{1F914}'} ♔♕♖♗♘♙♚♛♜♝♞♟︎ {'\u{1F914}'}{'\u{023F3}'}
      </dialog>

    </>
  );
}

export default App;
