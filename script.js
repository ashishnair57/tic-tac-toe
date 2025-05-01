const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status').querySelector('p');
const restartBtn = document.getElementById('restartBtn');
const choiceXBtn = document.getElementById('choiceX');
const choiceOBtn = document.getElementById('choiceO');
const playerChoiceDiv = document.getElementById('playerChoice');

let currentPlayer = '';
let playerXIcon = 'X';
let playerOIcon = 'O';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

choiceXBtn.addEventListener('click', () => setPlayerChoice('X'));
choiceOBtn.addEventListener('click', () => setPlayerChoice('O'));
restartBtn.addEventListener('click', restartGame);

function setPlayerChoice(player) {
    playerXIcon = player === 'X' ? 'X' : 'O';
    playerOIcon = player === 'X' ? 'O' : 'X';
    currentPlayer = player;
    playerChoiceDiv.style.display = 'none';
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }

    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWinner()) {
        gameActive = false;
        status.textContent = `${currentPlayer} wins!`;
        restartBtn.classList.remove('hidden');
    } else if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        status.textContent = "It's a tie!";
        restartBtn.classList.remove('hidden');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c] && gameBoard[a] !== '';
    });
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    currentPlayer = '';
    status.textContent = 'Waiting for players to choose their icons...';
    cells.forEach(cell => cell.textContent = '');
    restartBtn.classList.add('hidden');
    playerChoiceDiv.style.display = 'block';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
