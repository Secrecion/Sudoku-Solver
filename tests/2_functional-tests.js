const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Functional Tests", () => {
  suite("/api/solve Tests", function () {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          let complete =
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
          assert.equal(res.body.solution, complete);
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send()
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.g.2..9.47...8..1..16....926914.37.";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926915.37.";
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("/api/check Tests", function () {
    test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "A2",
          value: "3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "C1",
          value: "3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "B8",
          value: "2",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "A5",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          coordinate: "A5",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.g.2..9.47...8..1..16....926914.37.";
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidPuzzle,
          coordinate: "A5",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926915.3";
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidPuzzle,
          coordinate: "A5",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "A10",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validPuzzle,
          coordinate: "A5",
          value: "10",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
