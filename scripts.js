"use strict";

const boardSize = 3;

// Game Logic
const Gameboard = (() => {
  // Gameboard properties
  const PlayerOne = (name) => {
    return { name, mark: "O" };
  };
  const PlayerTwo = (name) => {
    return { name, mark: "X" };
  };

  const p1 = PlayerOne("");
  const p2 = PlayerTwo("");

  const gameboard = (() => {
    const arr = [];

    for (let i = 0; i < boardSize; i++) {
      const temp = [];
      for (let j = 0; j < boardSize; j++) {
        temp.push("");
      }
      arr.push(temp);
    }

    return arr;
  })();

  let gameStatus = false;
  // Gameboard methods
  const addMark = (mark, location) => {
    // Ex. of location: [1, 2]
    const [row, col] = location;
    if (!gameboard[row][col]) gameboard[row][col] = mark;
  };

  const isGameOver = () => {
    // The logic below will either return 'X'/'O' or 'tie'.
    // The if (output) makes sure the output of the checking isn't an empty string.

    // Check for across
    for (let i = 0; i < boardSize; i++) {
      if (
        gameboard[i][0] === gameboard[i][1] &&
        gameboard[i][1] === gameboard[i][2]
      ) {
        const output = gameboard[i][0];
        if (output) return output;
      }
    }

    // Check for straights
    for (let i = 0; i < boardSize; i++) {
      if (
        gameboard[0][i] === gameboard[1][i] &&
        gameboard[1][i] === gameboard[2][i]
      ) {
        const output = gameboard[0][i];
        if (output) return output;
      }
    }

    // Check for diagonals
    if (
      (gameboard[0][0] === gameboard[1][1] &&
        gameboard[1][1] === gameboard[2][2]) ||
      (gameboard[0][2] === gameboard[1][1] &&
        gameboard[1][1] === gameboard[2][0])
    ) {
      const output = gameboard[1][1];
      if (output) return output;
    }

    // Check for tie
    // let tie = false;

    // TBD: tie logic + DOM indicator
    for (let i = 0; i < boardSize; i++) {
      if (gameboard[i].includes("")) return 1;
    }

    return "tie";
  };

  const clearGameboard = () => {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        gameboard[i][j] = "";
      }
    }
  };

  return {
    addMark,
    isGameOver,
    clearGameboard,
    gameboard,
    gameStatus,
    p1,
    p2,
  };
})();

// DOM
// Initialization / Gameboard preparation
(() => {
  // Indexing table
  const tbodyEl = document.getElementById("gameboard-table").firstElementChild;
  for (let i = 0; i < boardSize; i++) {
    const currentRow = tbodyEl.children[i];
    currentRow.setAttribute("data-row", i);
    for (let j = 0; j < boardSize; j++) {
      const currentTD = currentRow.children[j];
      currentTD.setAttribute("data-col", j);
    }
  }

  // Setting theme + theme switch
  const root = document.documentElement;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // dark mode
    root.className = "dark";
  } else {
    root.className = "light";
  }
  const setTheme = function () {
    const root = document.documentElement;

    const newTheme = root.className === "dark" ? "light" : "dark";
    root.className = newTheme;
  };

  document
    .getElementById("icon--theme-switch")
    .addEventListener("click", setTheme);
})();


const gameboardDOM = (() => {
  let activePlayer = 1;

  const startBtn = document.getElementById("button--start");
  const restartBtn = document.getElementById("button--restart");
  const boxes = document.querySelectorAll("td");
  const p1Indicator = document.getElementById("indicator--p1");
  const p2Indicator = document.getElementById("indicator--p2");
  const winnerIndicator = document.getElementById("indicator--winner");

  const switchPlayer = function () {
    activePlayer = activePlayer == 1 ? 2 : 1;
    p1Indicator.classList.toggle("player--active");
    p2Indicator.classList.toggle("player--active");
  };

  const initGameDOM = function () {
    activePlayer = 1;
    p1Indicator.classList.remove("player--active");
    p2Indicator.classList.remove("player--active");

    p1Indicator.classList.toggle("player--active");
    Gameboard.p1.name = p1Indicator.querySelector("input").value;
    Gameboard.p2.name = p2Indicator.querySelector("input").value;
    winnerIndicator.innerHTML = "";

    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerHTML = "";
    }
  };

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function (event) {
      if (Gameboard.gameStatus) {
        const row = event.target.closest("tr").getAttribute("data-row");
        const col = boxes[i].getAttribute("data-col");

        if (!boxes[i].innerHTML) {
          if (activePlayer === 1) {
            Gameboard.addMark(Gameboard.p1.mark, [row, col]);
            boxes[i].innerHTML = Gameboard.p1.mark;
          } else if (activePlayer === 2) {
            Gameboard.addMark(Gameboard.p2.mark, [row, col]);
            boxes[i].innerHTML = Gameboard.p2.mark;
          }

          if (
            Gameboard.isGameOver() === Gameboard.p1.mark ||
            Gameboard.isGameOver() === Gameboard.p2.mark
          ) {
            const winner =
              Gameboard.isGameOver() === Gameboard.p1.mark
                ? Gameboard.p1
                : Gameboard.p2;
            const winnerName = winner.name
              ? winner.name
              : winner === Gameboard.p1
              ? "Player 1"
              : "Player 2";
            winnerIndicator.innerHTML = `Congrats, ${winnerName}!`;
            Gameboard.gameStatus = false;
          }

          if (Gameboard.isGameOver() === "tie") {
            winnerIndicator.innerHTML = "It's a tie!";
            Gameboard.gameStatus = false;
          }
          switchPlayer();
        }
      }
    });
  }

  // Buttons
  startBtn.addEventListener("click", function () {
    if (!Gameboard.gameStatus) {
      Gameboard.clearGameboard();
      initGameDOM();
      Gameboard.gameStatus = true;
    }
  });

  restartBtn.addEventListener("click", function () {
    Gameboard.clearGameboard();
    initGameDOM();
    Gameboard.gameStatus = true;
  });
})();
