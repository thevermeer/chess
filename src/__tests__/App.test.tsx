/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from "@testing-library/react";
import App from '../App'
import { CLJ } from '../Clojure';

//describe('Chess App', () => {
//  test('renders the initial chessboard', async () => {
//    let { findByTestId, findAllByRole } = render(<App />);
//    
//    const board = await findByTestId('chessboard');
//    expect(board).toBeTruthy();
//
//    const rows = await findAllByRole('row');
//    expect(rows.length).toBe(9); // 8 rows for chess pieces + 1 header row
//
//    const cells = await findAllByRole('button');
//    expect(cells.length).toBe(66); // 8x8 grid + 2
//  });
//
//  test('displays active team\'s turn', () => {
//    let { getByText } = render(<App />);
//    
//    const turnIndicator = getByText(/White's turn/i);
//    expect(turnIndicator).toBeTruthy();
//  });
//
//  test('clicking a cell selects and moves a piece', async () => {
//    let { findAllByRole } = render(<App />);
//    
//    const cells = await findAllByRole('button');
//    
//    // Select a white piece
//    fireEvent.click(cells[8]); // Assuming this cell contains a white pawn
//    
//    // Ensure the piece is selected
//    expect(cells[8].classList).toContain('selected');
//
//    // Move the selected piece to an available cell
//    fireEvent.click(cells[16]); // Assuming this cell is the destination
//
//    // Ensure the piece moved
//    expect(cells[8]).not.toHaveClass('selected');
//    expect(cells[16]).toHaveTextContent('pawn'); // Check if the destination cell now has the pawn
//  });
//
//  test('displays debug dialog with recCount', () => {
//    let { getByRole } = render(<App />);
//    
//    const debugDialog = getByRole('dialog');
//    expect(debugDialog).toBeInTheDocument();
//    expect(CLJ.pprint).toHaveBeenCalledWith([expect.any(Number)]);
//  });
//
//  test('handleCheckConditions button triggers condition check', () => {
//    let { getByText } = render(<App />);
//    
//    const checkButton = getByText(/Check 4 check/i);
//    fireEvent.click(checkButton);
//    
//    expect(CLJ.str).toHaveBeenCalled();
//    expect(CLJ.threadFirst).toHaveBeenCalled();
//  });
//});
//
//
//