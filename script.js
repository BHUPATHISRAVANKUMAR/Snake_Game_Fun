// Game constants and variables
const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const exitBtn = document.getElementById("exitBtn");
const finalScoreDisplay = document.getElementById("finalScore");
const gameOverSound = document.getElementById("gameOverSound");

const boardSize = 400;
const blockSize = 20;
let score = 0;
let speed = 300;
let snake = [{ x: 100, y: 100 }];
let direction = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let gameInterval;
let isPaused = false; // Track pause state

// Button events
startBtn.addEventListener("click", startGame);
exitBtn.addEventListener("click", () => window.close());
document.addEventListener("keydown", handleKeyPress);

// Start or restart the game
function startGame() {
    stopMusic();
    resetGame();
    placeFood();
    gameInterval = setInterval(updateGame, speed);
    startBtn.textContent = "Replay";
}

// Reset game state
function resetGame() {
    snake = [{ x: 100, y: 100 }];
    direction = { x: 1, y: 0 };
    score = 0;
    speed = 200;
    scoreDisplay.textContent = score;
    finalScoreDisplay.textContent = "";
    clearInterval(gameInterval);
}

// Handle key presses (spacebar for pause)
function handleKeyPress(event) {
    const key = event.key;

    if (key === " ") {
        togglePause();
    } else {
        changeDirection(event);
    }
}

// Toggle pause state
function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(updateGame, speed);
    } else {
        clearInterval(gameInterval);
    }
    isPaused = !isPaused;
}

// Update the game state
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        eatFood();
    }
    drawBoard();
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };
    head.x += direction.x * blockSize;
    head.y += direction.y * blockSize;
    snake.unshift(head);
    snake.pop();
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Place food at a random position
function placeFood() {
    food.x = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
    food.y = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
}

// Eat food and increase score
function eatFood() {
    score += 10;
    scoreDisplay.textContent = score;
    snake.push({});
    placeFood();
    increaseSpeed();
}

// Increase speed with score
function increaseSpeed() {
    clearInterval(gameInterval);
    speed = Math.max(50, speed - 10);
    gameInterval = setInterval(updateGame, speed);
}

// Change snake direction
function changeDirection(event) {
    const key = event.key;
    if (key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
    else if (key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
    else if (key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
    else if (key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
}

// End game and play music
function endGame() {
    clearInterval(gameInterval);
    gameOverSound.play();
    finalScoreDisplay.textContent = `Game Over! Final Score: ${score}`;
}

// Stop music when restarting
function stopMusic() {
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
}

// Draw the game board
function drawBoard() {
    gameBoard.innerHTML = "";
    snake.forEach(segment => {
        const snakeElement = document.createElement("div");
        snakeElement.style.left = `${segment.x}px`;
        snakeElement.style.top = `${segment.y}px`;
        snakeElement.classList.add("snake");
        gameBoard.appendChild(snakeElement);
    });
    const foodElement = document.createElement("div");
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}
