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

    return { getBoard, printBoard, fill };
}


function Cell() {
    let value = null;

    const fill = (symbol) => {
        value = symbol;
    }

    const getValue = () => value;

    return { getValue, fill };
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
    /*
    const validMove = (row, column) => {
        return board[row][column].getValue() === null;
    }
    */
    
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
        if (winner) {
            return true;
        }
        switchPlayerTurn();
        printRoundInfo();
    }

    printRoundInfo();

    return { getBoard, playRound, getActivePlayer };
    
}


function ScreenController() {
    const body = document.querySelector("body");
    const game = GameController("Xzibit", "Odawg");
    const boardDiv = document.querySelector(".game-board");
    let gameOver = false;

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

    boardDiv.addEventListener("click", clickHandlerBoard);
    update();

}

const screen = ScreenController();