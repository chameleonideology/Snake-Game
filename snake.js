// constants for game settings and elements
// the game board is 20x20
const boardSize = 20;
const board = document.getElementById('game-board');
const snake = [{x: 10, y: 10}];
const apple = {x: 5, y: 5};
let direction = {x: 1, y: 0};
// Default game speed in milliseconds
let gameSpeed = 500;
let timeSpent = 0;
let bestTime = localStorage.getItem('bestTime') || 0;
let lifelines = 3;
let isGameActive = false;
// default difficulty
let difficulty = 'normal';

// Timer and game intervals
let gameInterval;
let gameTimer;

document.getElementById('best-time').textContent = bestTime;
document.getElementById('lifelines').textContent = lifelines;

// Timer to track of how long the player survives
const gameTimerFunc = () => {
    gameTimer = setInterval(() => {
        // increase time spent by every secs
        timeSpent++;
        document.getElementById('time').textContent = timeSpent;

        // increase game speed as time paases (SPEED INCREASES EVERY 10 SECONDS)
        if (timeSpent % 10 === 0) {
            increaseGameSpeed();
        }
    }, 1000);
};

function increaseGameSpeed() {
    // Limit the speed increase
    if (gameSpeed > 100) {
        // Decrease the interval for faster speed
        gameSpeed -= 10;

        // Clear the previous interval
        clearInterval(gameInterval);
        // Restart with faster speed
        gameInterval = setInterval(moveSnake, gameSpeed)
    }
}

// Function to center the gameBoard using JS instead of CSS
function centerBoard() {
    board.style.width = `${boardSize * 20}px`;
    board.style.height = `${boardSize * 20}px`;
    // center horizontally
    board.style.margin = '20px auto';
    board.style.display = 'grid';
    board.style.border = '2px solid black';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 20px)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 20px)`;

    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.alignItems = 'center';
}

// Function to create the game board
function createBoard() {
    // Clear the board first
    board.innerHTML = '';
    // board.style.display = "grid";
    // board.style.gridTemplateColumns = `repeat(${boardSize}, 20px)`;
    // board.style.gridTemplateRows = `repeat(${boardSize}, 20px)`;

    // Create each cell of the game board
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.style.width = '20px';
        cell.style.height = '20px';
        cell.style.border = '1px solid #000';
        cell.style.boxSizing = 'border-box';
        board.appendChild(cell);
    }
}

// Function to draw the snake and the apple on the board

function drawGame() {
    const cells = board.children;
    // Clear the board by setting all cells to white
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = 'white';
    }

    // Draw the snake 
    snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        cells[index].style.backgroundColor = 'green';
    });

    // Draw the Apple
    const appleIndex = apple.y * boardSize + apple.x;
    cells[appleIndex].style.backgroundColor = 'red';
}

// function to move the snake and handle collisions
function moveSnake() {
    const newHead = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // Check if the snake hits the wall or itself
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    // Check for wall or self-collision
    // const hitWall =  newHead.x > 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize;
    // const hitSelf =  snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);

    // if (hitWall || hitSelf ) {
        if (lifelines > 1) {
            lifelines--;
            document.getElementById('lifelines').textContent = lifelines;
            alert(`You have lost a lifeline! Remaining: ${lifelines}`);
            // Reset the snake's position after losing a life
            resetSnakePosition();
            return;
        } else {
        // End the game if it runs into wall or itself
            endGame();
            return;
        }
    }
    // Add the new head to the snake's body 
    snake.unshift(newHead);
    // Check if the snake eats the apple
    if (newHead.x === apple.x && newHead.y === apple.y) {
        // place a new apple if eaten
        placeApple();
    } else {
        // Remove the last segment of the snake (move the tail)
        snake.pop();
    }
  //Redraw the snake and apple after moving
    drawGame();
}

// Function to reset snake's position after losing a lifeline
function resetSnakePosition() {
    // Reset snake to one segment
    snake.length = 1;
    // Reset snake's position to the center
    snake[0] = {x: 10, y: 10};
    // Reset direction to right
    direction = {x: 1, y: 0};
    createBoard();
    // Redrew snake and apple
    drawGame();
}

//Function to place the apple in a new random direction
function placeApple () {
    // Random x position between 0 and boardSize
    apple.x = Math.floor(Math.random() * boardSize);
    // Random y position between 0 and boardSize
    apple.y = Math.floor(Math.random() * boardSize);
}

// Function to end the game 
function endGame() {
    // stop the snake from moving
    clearInterval(gameInterval);
    // stop the timer
    clearInterval(gameTimer);
    // show user how long they survive 
    document.getElementById('game-status').textContent = `Game over! You survived for ${timeSpent} seconds`;

    // Update the best time if the current time is better
    if (timeSpent > bestTime) {
        // Set new best time
        bestTime = timeSpent; 
        // Save it in localStorage
        localStorage.setItem('bestTime', bestTime);
        // Update best time display
        document.getElementById('best-time').textContent = bestTime;
        // Notify the user of the new records
        alert(`New record! ${bestTime} seconds!`);
    }
    isGameActive = false;
    // Enable restart button
    document.getElementById('restart-btn').disabled = false;
}


// Function to handle user input for changing snake direction\\
document.addEventListener('keydown', (event) => {
    if (!isGameActive) return;

    if (event.key === 'ArrowUp' && direction.y === 0) {
        // Move up if not already moving vertically
        direction = {x: 0, y: -1};
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        // Move down
        direction = {x: 0, y: 1};
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        // move left
        direction = {x: -1, y: 0};
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        // move right
        direction = {x: 1, y: 0};
    }
});

// Movement buttons for touchScreen Users
document.getElementById('move-up').addEventListener('click', () => {
    if (direction.y === 0) direction = {x: 0, y: -1};
});

document.getElementById('move-down').addEventListener('click', () => {
    if (direction.y === 0) direction = {x: 0, y: 1};
});

document.getElementById('move-left').addEventListener('click', () => {
    if (direction.x === 0) direction = {x: -1, y: 0};
});

document.getElementById('move-up').addEventListener('click', () => {
    if (direction.x === 0) direction = {x: 1, y: 0};
});

// Function to start the game
function startGame() {
    lifelines = 3;
    document.getElementById('lifelines').textContent = lifelines;
    // Reset direction to right
    direction = {x: 1, y: 0};
    timeSpent = 0;
    document.getElementById('time').textContent = timeSpent;
    // Reset snake to one segment
    snake.length = 1;
    // Reset snakes position
    snake[0] = {x: 10, y: 10};
    createBoard();
    drawGame();
    // START the timer
    gameTimerFunc(); 
    // Set speed based on difficulty
    setDifficulty();
    // Start moving snake
    gameInterval = setInterval(moveSnake, gameSpeed);
    isGameActive = true;
    // Disabled start button during game
    document.getElementById('start-btn').disabled = true;
    // Disable retart button until game ends
    document.getElementById('restart-btn').disabled = true;
    

}
// Restart game function
function restartGame() {
    // Stop the previous game interval
    clearInterval(gameInterval);
    // Stop the timer
    clearInterval(gameTimer)
    // Start a new game
    startGame();
}

// Set game speed based on difficulty
function setDifficulty() {
    let difficulty =  document.getElementById('difficulty').value;

    if (difficulty === 'easy') {
        // Slow
        gameSpeed = 500;
    } else if (difficulty === 'normal') {
        // Normal speed
        gameSpeed = 300;
    } else if (difficulty === 'difficult') {
        // Fast
        gameSpeed = 150;
    }
}

// Center the game board on load
   centerBoard();

// Add event listeners to buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);