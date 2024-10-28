function Board() {
    const gridLength = 3;
    const board = [];

    for (let i = 0; i < gridLength; i++) {
        board[i] = [];
        for (let j=0; j < gridLength; j++) {
            board[i].push(Cell())
        }
    }

    const fill = (row, column, symbol) => {
        board[row][column].fill(symbol);
    }

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map(row => row.map(cell => cell.getValue())));
    }

    const clear = () => board.map(row => row.map(cell => cell.clear()));

    return { getBoard, printBoard, fill, clear };
}


function Cell() {
    let value = null;

    const fill = (symbol) => {
        value = symbol;
    }

    const getValue = () => value;

    const clear = () => fill(null);

    return { getValue, fill, clear };
}

function Player(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
}

function GameController(xPlayerName, oPlayerName) {
    const board = Board();
    const players = {
        X: Player(xPlayerName, "X"),
        O: Player(oPlayerName, "O")
    };


    const getBoard = board.getBoard;
    
    let activePlayer = players.X;

    const getActivePlayer = () => activePlayer;

    const printRoundInfo = () => {
        board.printBoard();
        console.log(getActivePlayer());
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players.X) ? players.O : players.X;
    }

    const calcScores = () => {
        const scoreBoard = board.getBoard().map(row => row.map(cell => {
            const val = cell.getValue();
            if (val == players.X.getSymbol()) {
                return 1;
            } else if (val == players.O.getSymbol()) {
                return -1;
            } else {
                return 0;
            }
        }
            ));
        const colSums = [];
        const rowSums = [];
        const diagSums = [scoreBoard[0][0]+scoreBoard[1][1]+scoreBoard[2][2],
                          scoreBoard[2][0]+scoreBoard[1][1]+scoreBoard[0][2]];
        for (let i=0; i<3; i++) {
            let col = 0;
            let row = 0;
            for (let j=0; j<3; j++) {
                col += scoreBoard[j][i];
                row += scoreBoard[i][j];
            }
            colSums.push(col);
            rowSums.push(row);
        }
        return {
            row: rowSums,
            column: colSums,
            diagonal: diagSums
        };
    }

    const checkWinner = (scores) => {
        for (const key in scores) {
            if (Math.max(...scores[key]) == 3) {
                return players.X;
            } else if (Math.min(...scores[key]) == -3) {
                return players.O;
            }
        }
        return null;
    }

    const playRound = (row, column) => {
        const validMove = (board.getBoard()[row][column].getValue() === null);
        if (!validMove) {
            return;
        }
        board.fill(row, column, getActivePlayer().getSymbol());
        const scores = calcScores();
        const winner = checkWinner(scores);
        const tie = !(board.getBoard().flat().map(cell => cell.getValue()).includes(null));

        if (winner) {
            return winner.getName();
        } else if (tie) {
            return "Tie";
        } else {
            switchPlayerTurn();
        }
        
    }

    const newGame = board.clear;

    return { getBoard, playRound, getActivePlayer, newGame };
    
}


function ScreenController(playerXName, playerOName) {

    const game = GameController(playerXName, playerOName);
    const body = document.querySelector("body");
    const infoDiv = document.querySelector("#info");
    const boardDiv = document.querySelector(".game-board");
    let gameOver = false;


    const newGameButton = document.getElementById("new-game-btn");

    newGameButton.addEventListener("click", () => {
        gameOver = false;
        game.newGame();
        infoDiv.textContent = "";
        update();
    })

    const update = () => {
        body.classList = [game.getActivePlayer().getSymbol()];
        boardDiv.innerHTML = "";

        const board = game.getBoard();
        board.forEach((row, rowNum) => {
            row.forEach((cell, column) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                if (!gameOver) {
                    cellButton.classList.add("active");
                }
                cellButton.dataset.row = rowNum;
                cellButton.dataset.column = column; 
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
        if (gameOver) {
            winScreen();
        }
    }

    const clickHandlerBoard = (e) => {
        if (!gameOver) {
            const row = e.target.dataset.row;
            const column = e.target.dataset.column;
            if (!row || !column) {
                return;
            }
            gameOver = game.playRound(row, column);
            update();
        } 
    }

    const winScreen = () => {
        if (gameOver === "Tie") {
            infoDiv.textContent = "Tie!";
        } else {
            infoDiv.textContent = `${gameOver} wins!`;
        }
        newGameButton.style.display = "block";
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    update();

}



const playerXName = prompt("Enter Player X Name:");
const playerOName = prompt("Enter Player O Name:")
const screen = ScreenController(playerXName, playerOName);