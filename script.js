const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
    dx: 5,
    dy: 5
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
    computer.x += computer.dx;

    // Keep paddles within bounds
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

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
    if (ball.y - ball.radius < 0) {
        playerScore++;
        resetBall();
    } else if (ball.y + ball.radius > canvas.height) {
        computerScore++;
        resetBall();
    }

    // Computer AI
    const computerLevelSpeed = 0.1 + (level - 1) * 0.02;
    const computerTargetX = ball.x - computer.width / 2;
    computer.x += (computerTargetX - computer.x) * computerLevelSpeed;


    // Level up
    if (playerScore > 0 && playerScore % 5 === 0 && level < 5) {
        level++;
        playerScore = 0; // Reset score for next level
        computerScore = 0;
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
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dy *= -1;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.dx = -8;
            break;
        case 'd':
            player.dx = 8;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'a':
        case 'd':
            player.dx = 0;
            break;
    }
});


// Start the game loop
gameLoop();