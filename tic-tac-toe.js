function Board() {
    const gridLength = 3;
    const board = [];

    for (let i = 0; i < gridLength; i++) {
        board[i] = [];
        for (let j=0; j < gridLength; j++) {
            board[i].push(Cell())
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map(row => row.map(cell => cell.getValue())));
    }

    return { getBoard, printBoard };
}


function Cell() {
    let value = null;

    const fill = (player) => {
        value = player.getSymbol();
    }

    const getValue = () => value;

    return { getValue, fill };
}

function Player(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
}

function Game() {
    const board = Board();
    const players = [
        Player("Xzibit", "X"),
        Player("Odawg", "O")
    ];
}


const board = Board();
board.printBoard();


