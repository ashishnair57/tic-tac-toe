const gameModePopup = document.getElementById("gameModePopup");
const iconChoicePopup = document.getElementById("iconChoicePopup");
const vsFriendBtn = document.getElementById("vsFriendBtn");
const vsAIBtn = document.getElementById("vsAIBtn");
const choiceXBtn = document.getElementById("choiceX");
const choiceOBtn = document.getElementById("choiceO");
const gameContainer = document.getElementById("gameContainer");
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.querySelector("#status p");
const restartBtn = document.getElementById("restartBtn");
const resetBtn = document.createElement('button'); // Create reset button

let gameBoard = Array(9).fill('');
let currentPlayer = '';
let playerX = 'X';
let playerO = 'O';
let gameActive = false;
let vsAI = false;

vsFriendBtn.addEventListener('click', () => {
    vsAI = false;
    gameModePopup.classList.add("hidden");
    iconChoicePopup.classList.remove("hidden");
});

vsAIBtn.addEventListener('click', () => {
    vsAI = true;
    gameModePopup.classList.add("hidden");
    iconChoicePopup.classList.remove("hidden");
});

choiceXBtn.addEventListener('click', () => {
    playerX = 'X';
    playerO = 'O';
    currentPlayer = 'X';
    startGame();
});

choiceOBtn.addEventListener('click', () => {
    playerX = 'O';
    playerO = 'X';
    currentPlayer = 'O';
    startGame();
});

function startGame() {
    iconChoicePopup.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;

    // Append reset button to the game container
    resetBtn.textContent = "Reset Game";
    resetBtn.style.padding = "10px 20px";
    resetBtn.style.fontSize = "16px";
    resetBtn.style.marginTop = "20px";
    resetBtn.style.backgroundColor = "#dc3545"; // Red background
    resetBtn.style.color = "white";
    resetBtn.style.border = "none";
    resetBtn.style.borderRadius = "8px";
    resetBtn.style.cursor = "pointer";
    resetBtn.addEventListener('click', resetGame);
    gameContainer.appendChild(resetBtn);
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute("data-index");

    if (!gameActive || gameBoard[index]) return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) {
        gameActive = false;
        status.textContent = `${currentPlayer} wins!`;
        restartBtn.classList.remove("hidden");
        return;
    }

    if (gameBoard.every(val => val !== '')) {
        gameActive = false;
        status.textContent = "It's a tie!";
        restartBtn.classList.remove("hidden");
        return;
    }

    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    status.textContent = `Player ${currentPlayer}'s turn`;

    if (vsAI && currentPlayer === playerO) {
        setTimeout(aiMove, 300);
    }
}

function aiMove() {
    let bestMove = getBestMove(gameBoard, playerO);
    let cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    handleCellClick({ target: cell });
}

function getBestMove(board, player) {
    const opponent = (player === playerX) ? playerO : playerX;
    
    // 1. First, check if AI can win
    let winMove = findWinningMove(board, player);
    if (winMove !== -1) return winMove;

    // 2. Second, block the player from winning
    let blockMove = findBlockingMove(board, opponent);
    if (blockMove !== -1) return blockMove;
    
    // 3. If no winning or blocking move, try to take the center if it's free
    if (board[4] === '') return 4;  // Center is the best place to take
    
    // 4. If no center, check if corners are free (strategic move)
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (board[corner] === '') return corner;
    }
    
    // 5. If no winning/blocking moves, take the first available empty spot
    return findFirstEmptySpot(board);
}

function findBlockingMove(board, opponent) {
    return findWinningMove(board, opponent);
}

function findWinningMove(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const values = [board[a], board[b], board[c]];

        // If two cells are occupied by the same player and the third one is empty
        if (values.filter(val => val === player).length === 2 && values.includes('')) {
            return pattern[values.indexOf('')];
        }
    }
    return -1; // No winning move
}

function findFirstEmptySpot(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') return i;
    }
    return -1; // No empty spot (should never happen in this context)
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

restartBtn.addEventListener('click', () => {
    gameBoard = Array(9).fill('');
    gameActive = true;
    restartBtn.classList.add("hidden");
    currentPlayer = playerX;
    status.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
});

function resetGame() {
    // Reset the game state and UI elements
    gameBoard = Array(9).fill('');
    gameActive = false;
    currentPlayer = '';
    vsAI = false;

    // Hide the game container and show the game mode popup
    gameContainer.classList.add("hidden");
    gameModePopup.classList.remove("hidden");

    // Clear the game board visually
    cells.forEach(cell => {
        cell.textContent = '';  // Clear cell content
        cell.classList.remove('x', 'o');  // Remove the 'x' or 'o' classes
    });

    // Remove the reset button after resetting
    if (resetBtn.parentNode) {
        resetBtn.parentNode.removeChild(resetBtn);
    }

    // Hide the restart button and clear status
    restartBtn.classList.add("hidden");
    status.textContent = '';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
