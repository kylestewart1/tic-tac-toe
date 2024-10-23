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

function GameController() {
    const board = Board();
    const players = [
        Player("Xzibit", "X"),
        Player("Odawg", "O")
    ];


    const getBoard = board.getBoard;

    const validMove = (row, column) => {
        return board[row][column].getValue() === null;
    }
    
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const printRoundInfo = () => {
        board.printBoard();
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }

    const playRound = (row, column) => {
        board.fill(row, column, getActivePlayer().getSymbol());
        switchPlayerTurn();
        printRoundInfo();
    }

    printRoundInfo();

    return { getBoard, playRound, getActivePlayer };
    
}


function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector(".game-board");

    const update = () => {
        boardDiv.innerHTML = "";

        const board = game.getBoard();
        board.forEach(row => {
            row.forEach((cell) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }
    update();

    return { update };
}

const screen = ScreenController();
screen.update();