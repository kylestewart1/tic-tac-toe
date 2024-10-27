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
        const validMove = (board[row][column].getValue() === null);
        if (validMove) {
            board[row][column].fill(symbol);
        }
        return validMove;
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
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players.X) ? players.O : players.X;
    }

    const playRound = (row, column) => {
        console.log(getActivePlayer().getSymbol());
        const validMove = board.fill(row, column, getActivePlayer().getSymbol());
        if (!validMove) {
            return;
        }
        switchPlayerTurn();
        printRoundInfo();
    }

    printRoundInfo();

    return { getBoard, playRound, getActivePlayer };
    
}


function ScreenController() {
    const body = document.querySelector("body");
    const game = GameController();
    const boardDiv = document.querySelector(".game-board");

    const update = () => {
        body.classList = [game.getActivePlayer().getSymbol()];
        boardDiv.innerHTML = "";

        const board = game.getBoard();
        board.forEach((row, rowNum) => {
            row.forEach((cell, column) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowNum;
                cellButton.dataset.column = column; 
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    const clickHandlerBoard = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;
        console.log(`row ${row}, column ${column}`)
        if (!row || !column) {
            return;
        }

        game.playRound(row, column);
        update();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    update();

}

const screen = ScreenController();