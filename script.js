let currentPlayer = 'X';  // Tracks the current player ('X' or 'O')
let gameBoard = [];       // Stores the game board state
let gridSize, winCondition;  // Variables to store grid size and win condition (number in a row needed to win)

/* 
 * This function is called when the game starts.
 * It reads grid size and win condition from user input and validates them.
 */
function startGame() {
    gridSize = parseInt(document.getElementById('grid-size').value);  // Get grid size from input
    winCondition = parseInt(document.getElementById('win-condition').value);  // Get win condition from input

    // Validate that the grid size and win condition are within allowed limits
    if (gridSize < 3 || gridSize > 10 || winCondition < 3 || winCondition > gridSize) {
        alert('Invalid input. Grid size must be between 3 and 10, and win condition must be between 3 and grid size.');
        return;
    }

    // Hide the setup section and display the game container
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Initialize the game board
    initializeGame();
}

/* 
 * Initializes the game board with empty cells, resets the current player to 'X',
 * and sets up the HTML grid.
 */
function initializeGame() {
    gameBoard = Array(gridSize).fill().map(() => Array(gridSize).fill(''));  // Create an empty game board
    currentPlayer = 'X';  // Reset the current player to 'X'

    const board = document.getElementById('game-board');
    board.innerHTML = '';  // Clear any existing board
    board.style.gridTemplateColumns = `repeat(${gridSize}, var(--cell-size))`;  // Set the grid columns dynamically

    // Create cells for the board and attach event listeners to handle clicks
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');  // Add cell styling class
            cell.addEventListener('click', () => makeMove(i, j));  // Attach click event to make a move
            board.appendChild(cell);  // Add the cell to the game board
        }
    }

    updateMessage(`Player ${currentPlayer}'s turn`);  // Display a message indicating the current player's turn
}

/* 
 * This function handles a player's move when they click on a cell.
 * It updates the game state and checks for a win or a draw.
 */
function makeMove(row, col) {
    if (gameBoard[row][col] === '') {  // Only allow a move if the cell is empty
        gameBoard[row][col] = currentPlayer;  // Mark the cell with the current player's symbol

        // Update the visual cell content
        const cells = document.getElementsByClassName('cell');
        const cell = cells[row * gridSize + col];  // Get the correct cell element
        cell.textContent = currentPlayer;  // Display the player's symbol ('X' or 'O')
        cell.classList.add(currentPlayer.toLowerCase());  // Add the class for styling (x or o)
        cell.classList.add('pop');  // Add pop animation class

        // Check if the current player has won the game
        if (checkWin(row, col)) {
            updateMessage(`Player ${currentPlayer} wins!`);  // Display a win message
            disableBoard();  // Disable further moves on the board
        } else if (checkDraw()) {
            updateMessage("It's a draw!");  // Display a draw message if the board is full and no one has won
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch to the other player
            updateMessage(`Player ${currentPlayer}'s turn`);  // Update message for the next player's turn
        }
    }
}

/* 
 * This function checks whether the current player has won after placing a mark at (row, col).
 * It checks in 4 directions (horizontal, vertical, two diagonals).
 */
function checkWin(row, col) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]  // Horizontal, vertical, diagonal (top-left to bottom-right), diagonal (top-right to bottom-left)
    ];

    // Check in each direction for a winning line
    for (const [dx, dy] of directions) {
        let count = 1;  // Count starts at 1 to include the current mark
        count += countDirection(row, col, dx, dy);  // Count marks in the forward direction
        count += countDirection(row, col, -dx, -dy);  // Count marks in the backward direction

        // If the total count of marks in any direction meets or exceeds the win condition, return true
        if (count >= winCondition) {
            return true;
        }
    }

    return false;  // Return false if no win is found
}

/* 
 * Helper function to count consecutive marks in a specified direction (dx, dy).
 * It moves in the direction (dx, dy) starting from (row, col) until it hits a different mark or goes out of bounds.
 */
function countDirection(row, col, dx, dy) {
    let count = 0;
    let x = row + dx;
    let y = col + dy;

    // Keep counting in the direction until you find an empty cell or a different mark
    while (
        x >= 0 && x < gridSize &&  // Stay within bounds of the grid
        y >= 0 && y < gridSize &&
        gameBoard[x][y] === currentPlayer  // Continue only if the cell has the current player's mark
    ) {
        count++;  // Increment count for every consecutive mark found
        x += dx;  // Move in the specified direction
        y += dy;
    }

    return count;
}

/* 
 * This function checks whether the game is a draw (i.e., no more empty cells left).
 */
function checkDraw() {
    return gameBoard.every(row => row.every(cell => cell !== ''));  // Return true if every cell is filled
}

/* 
 * Updates the message displayed to players (e.g., showing whose turn it is or who won).
 */
function updateMessage(msg) {
    document.getElementById('message').textContent = msg;
}

/* 
 * Disables all cells on the game board to prevent further moves after the game is over.
 */
function disableBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.style.pointerEvents = 'none';  // Disable clicks on all cells
    }
}

/* 
 * Resets the game and shows the setup screen again.
 */
function resetGame() {
    document.getElementById('setup').style.display = 'block';  // Show setup form
    document.getElementById('game-container').style.display = 'none';  // Hide the game board
    document.getElementById('grid-size').value = '3';  // Reset grid size input
    document.getElementById('win-condition').value = '3';  // Reset win condition input
}
