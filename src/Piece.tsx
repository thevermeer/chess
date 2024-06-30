export type Role = 'pawn' | 'rook' | 'bishop' | 'castle' | 'queen' | 'king';
export type Team = 'black' | 'white';

export const Black: Team = 'black';
export const White: Team = 'white';

/**
 * function: getOtherTeam
 * ----------------------
 * @param team - string - either black or white
 * @returns the other team than was passed as team :)
 */
export function getOtherTeam(team: Team) {
  return team === White ? Black : White;
}

export type Piece = {
  role: Role,
  color: Team;
};

export const pieceToChar = {
  pawn: "♟︎",
  rook: "♞",
  bishop: "♝",
  castle: "♜",
  queen: "♛",
  king: "♚"
}

/**
 * const: pieceValue
 * -----------------
 * @param key - concatenation of Team and Piece name
 * @value number -  integer value of piece weighting
 */
export const pieceValue: { [key: string]: number } = {
  'whitepawn': 80,
  'whiterook': 120,
  'whitebishop': 150,
  'whitecastle': 180,
  'whitequeen': 200,
  'whiteking': 10000000,
  'blackpawn': -80,
  'blackrook': -120,
  'blackbishop': -150,
  'blackcastle': -180,
  'blackqueen': -200,
  'blackking': -10000000
};

/**
 * const: positionBonus
 * -----------------
 * @param key - concatenation of Team and Piece name
 * @value number -  integer value of piece weighting
 */
export const positionBonus: { [key: string]: number[] } = {
  'whitepawn': [100, 30, 25, 20, 15, 10, 5, 0],
  'whiterook': [5, 10, 15, 20, 20, 15, 10, 5],
  'whitebishop': [5, 10, 15, 20, 20, 15, 10, 5],
  'whitecastle': [10, 15, 20, 25, 25, 20, 15, 10],
  'whitequeen': [5, 10, 15, 20, 20, 15, 10, 5],
  'whiteking': [-30, -25, -20, -15, -10, -5, 0, 0],
  'blackpawn': [0, -5, -10, -15, -20, -25, -30, -100],
  'blackrook': [-5, -10, -15, -20, -20, -15, -10, -5],
  'blackbishop': [-5, -10, -15, -20, -20, -15, -10, -5],
  'blackcastle': [-10, -15, -20, -25, -25, -20, -15, -10],
  'blackqueen': [-5, -10, -15, -20, -20, -15, -10, -5],
  'blackking': [0, 0, 5, 10, 15, 20, 25, 30]
}

