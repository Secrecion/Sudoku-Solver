class SudokuSolver {
  validate(puzzle) {
    if (!puzzle) {
      return "Required field missing";
    }
    if (puzzle.length != 81) {
      return "Expected puzzle to be 81 characters long";
    }
    if (/[^1-9.]/g.test(puzzle)) {
      return "Invalid characters in puzzle";
    }
    return "Valid";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid=this.stringToSudokuArray(puzzleString);
    row=this.letterToNumber(row);
    for(let i=0; i<9; i++){
      if(grid[row-1][i]==value){
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid=this.stringToSudokuArray(puzzleString);
    for(let i=0; i<9; i++){
      if(grid[i][column-1]==value){
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.stringToSudokuArray(puzzleString);
    row = this.letterToNumber(row)-1;
    col= col-1;
    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == value) return false;
    return true;
  }

  stringToSudokuArray(sudokuString) {
    const N = 9;
    const sudokuArray = [];

    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        const index = i * N + j;
        const value = sudokuString.charAt(index);
        row.push(value === "." ? 0 : parseInt(value));
      }
      sudokuArray.push(row);
    }

    return sudokuArray;
  }

  solve(puzzleString) {}

  solveSudoku(board) {
    const N = 9; // Size of the Sudoku grid

    // Find an empty cell in the board
    function findEmptyLocation(board, row, col) {
      for (row = 0; row < N; row++) {
        for (col = 0; col < N; col++) {
          if (board[row][col] === 0) {
            return [row, col];
          }
        }
      }
      return [-1, -1]; // If no empty location is found
    }

    // Check if it's safe to place a number in a given position
    function isSafe(board, row, col, num) {
      // Check if the number is not present in the current row and column
      for (let x = 0; x < N; x++) {
        if (board[row][x] === num || board[x][col] === num) {
          return false;
        }
      }

      // Check if the number is not present in the current 3x3 subgrid
      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }

      return true;
    }

    // Main solver function using backtracking
    function solve() {
      const [row, col] = findEmptyLocation(board);

      // If no empty cell is found, the puzzle is solved
      if (row === -1 && col === -1) {
        return true;
      }

      // Try placing numbers 1 to 9 in the empty cell
      for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
          // Place the number if it's safe
          board[row][col] = num;

          // Recursively solve the rest of the puzzle
          if (solve()) {
            return true; // If the puzzle is solved, stop recursion
          }

          // If placing the number leads to an invalid solution, backtrack
          board[row][col] = 0;
        }
      }

      return false; // If no number can be placed, backtrack
    }

    // Call the solve function to solve the Sudoku puzzle
    if (solve()) {
      return board;
    } else {
      return false;
    }
  }

  completeSudoku(puzzleString) {
    if (this.validate(puzzleString) != "Valid") {
      return false;
    }
    const board = this.stringToSudokuArray(puzzleString);
    const solvedBoard = this.solveSudoku(board);
    if(!solvedBoard){
      return false;
    }
    return solvedBoard.flat().join("");
  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }
}

module.exports = SudokuSolver;

