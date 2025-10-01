const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'pre-game'; // 'pre-game', 'playing', 'game-over'

// Game objects
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    color: '#fff',
    dx: 0
};

const computer = {
    x: canvas.width / 2 - 50,
    y: 10,
    width: 100,
    height: 10,
    color: '#fff',
    dx: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: '#fff',
    dx: 0,
    dy: 0
};

let playerScore = 0;
let computerScore = 0;
let level = 1;

// Draw functions
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '30px Courier New';
    ctx.fillText(text, x, y);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Move paddles
    player.x += player.dx;

    // Keep paddles within bounds
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (gameState === 'playing') {
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with left and right walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
        }

        // Ball collision with paddles
        if (
            ball.y + ball.radius > player.y &&
            ball.x > player.x &&
            ball.x < player.x + player.width
        ) {
            ball.dy *= -1;
        }

        if (
            ball.y - ball.radius < computer.y + computer.height &&
            ball.x > computer.x &&
            ball.x < computer.x + computer.width
        ) {
            ball.dy *= -1;
        }

        // Scoring
        if (ball.y - ball.radius < 0) { // Player scores
            playerScore++;
            if (playerScore >= 5) {
                if (level < 5) {
                    level++;
                    playerScore = 0;
                    computerScore = 0;
                } else {
                    gameState = 'game-over';
                }
            }
            if (gameState !== 'game-over') {
                gameState = 'pre-game';
                resetBall();
            }
        } else if (ball.y + ball.radius > canvas.height) { // Computer scores
            computerScore++;
            gameState = 'pre-game';
            resetBall();
        }

        // Computer AI
        if (ball.dy < 0) {
            const computerLevelSpeed = 0.05 + (level - 1) * 0.02;
            const computerTargetX = ball.x - computer.width / 2;
            computer.x += (computerTargetX - computer.x) * computerLevelSpeed;
        }
    }
}

// Draw game objects
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw score and level
    drawText(`Player: ${playerScore}`, 100, 50, '#fff');
    drawText(`Computer: ${computerScore}`, canvas.width - 300, 50, '#fff');
    drawText(`Level: ${level}`, canvas.width / 2 - 50, 50, '#fff');

    if (gameState === 'pre-game') {
        drawText("Press 'a' or 'd' to start", canvas.width / 2 - 200, canvas.height / 2 + 50, '#fff');
    } else if (gameState === 'game-over') {
        drawText("You Win! Play again? (Y)", canvas.width / 2 - 250, canvas.height / 2 + 50, '#fff');
    }
}

// Reset ball and paddles to the center and stop their movement.
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 0;
    ball.dy = 0;

    player.x = canvas.width / 2 - 50;
    computer.x = canvas.width / 2 - 50;
    player.dx = 0;
    computer.dx = 0;
}

function restartGame() {
    level = 1;
    playerScore = 0;
    computerScore = 0;
    gameState = 'pre-game';
    resetBall();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (gameState === 'pre-game' && (key === 'a' || key === 'd')) {
        gameState = 'playing';
        // Set ball's horizontal direction based on player's first move
        ball.dx = (key === 'a') ? -5 : 5;
        // Set ball's vertical direction to move towards the player
        ball.dy = 5;
    } else if (gameState === 'game-over' && key === 'y') {
        restartGame();
        return;
    }

    if (gameState === 'playing' || gameState === 'pre-game') {
        switch (key) {
            case 'a':
                player.dx = -8;
                break;
            case 'd':
                player.dx = 8;
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'd') {
        player.dx = 0;
    }
});

// Initial setup
resetBall();

// Start the game loop
gameLoop();