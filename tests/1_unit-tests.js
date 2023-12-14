const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Unit Tests", () => {

  suite("Solver Tests", function () {

    test("Logic handles a valid puzzle string of 81 characters", function (done) {
      assert.equal(solver.validate(validPuzzle), "Valid");
      done();
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
        let invalidPuzzle =
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.b674.3.7.2..9.47...8..1..16....926914.37.";
          assert.equal(solver.validate(invalidPuzzle), "Invalid characters in puzzle");
        done();
      });

      test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
        let invalidPuzzle =
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914..";
          assert.equal(solver.validate(invalidPuzzle),"Expected puzzle to be 81 characters long");
        done();
      });

  });

  suite("Row Tests", function () {

    test("Logic handles a valid row placement", function (done) {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, "A", "column", 3));
      done();
    });

    test("Logic handles an invalid row placement", function (done) {
        assert.isFalse(solver.checkRowPlacement(validPuzzle, "A", "column", 8));
        done();
      });

  });

  suite("Column Tests", function () {

    test("Logic handles a valid column placement", function (done) {
      assert.isTrue(solver.checkColPlacement(validPuzzle, "row", 2, 1));
      done();
    });

    test("Logic handles an invalid column placement", function (done) {
        assert.isFalse(solver.checkColPlacement(validPuzzle, "row", 2, 9));
        done();
      });

  });

  suite("Region Tests", function () {

    test("Logic handles a valid region (3x3 grid) placement", function (done) {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, "A", 2, 3));
      done();
    });

    test("Logic handles an invalid region (3x3 grid) placement", function (done) {
        assert.isFalse(solver.checkRegionPlacement(validPuzzle, "A", 2, 6));
      done();
      });

  });

  suite("Solver Tests", function () {
    test("Valid puzzle strings pass the solver", function (done) {
      let complete =
        "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
      assert.equal(solver.completeSudoku(validPuzzle), complete);
      done();
    });

    test("Invalid puzzle strings fail the solver", function (done) {
        let invalidPuzzle =
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.b674.3.7.2..9.47...8..1..16....926914.37.";
        assert.isFalse(solver.completeSudoku(invalidPuzzle));
        done();
      });

      test("Solver returns the expected solution for an incomplete puzzle", function (done) {
        let invalidPuzzle =
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914..";
          assert.isFalse(solver.completeSudoku(invalidPuzzle));
        done();
      });

  });

});
