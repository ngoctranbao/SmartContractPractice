document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    const gridSize = 20;
    const blockSize = 30;

    // Load images
    const headImage = new Image();
    const bodyImage = new Image();
    const tailImage = new Image();
    const appleImage = new Image();

    headImage.src = "img/head2.png";
    bodyImage.src = 'img/body.png';
    tailImage.src = 'img/tail.png';
    appleImage.src = 'img/apple.png';
    
    let apple = { x: 15, y: 10 };

    function drawApple() {
        context.drawImage(appleImage, apple.x * blockSize, apple.y * blockSize, blockSize, blockSize);
    }

    // Snake representation
    const snake = [
        { type: 'head', x: 5, y: 10 },
        { type: 'body', x: 4, y: 10 },
        { type: 'body', x: 3, y: 10 },
        { type: 'tail', x: 2, y: 10 }
    ];

    function drawSnake() {
        snake.forEach((segment, index) => {
            const image = getImageByType(segment.type);
    
            // Calculate the position of the snake segment
            const x = segment.x * blockSize;
            const y = segment.y * blockSize;
    
            // Set the center of rotation to the center of the image
            const centerX = x + blockSize / 2;
            const centerY = y + blockSize / 2;
    
            // Rotate the canvas
            context.translate(centerX, centerY);
            context.rotate(getRotation(index) * (Math.PI / 180));
            context.translate(-centerX, -centerY);
    
            // Draw the rotated image
            context.drawImage(image, x, y, blockSize, blockSize);
    
            // Reset the canvas rotation
            context.setTransform(1, 0, 0, 1, 0, 0);
        });
    }
    
    function getRotation(index) {
        // Determine the rotation angle based on the direction
        const isHead = index === 0;
        if (isHead) {
            switch (direction) {
                case 'up':
                    return -90;
                case 'down':
                    return 90;
                case 'left':
                    return 180;
                case 'right':
                    return 0;
                default:
                    return 0;
            }
        }
    }

    // Function to generate a new apple at a random position
    function generateApple() {
        apple = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
        };

        // Ensure the apple is not generated on the snake
        while (isCollision(apple, snake)) {
            apple = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize),
            };
        }
    }

    // Function to check if two positions collide
    function isCollision(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }

    // Snake direction
    let direction = 'right';

    function updateGame() {
        // Move the snake
        moveSnake();

        // Clear the canvas
        // context.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the game
        drawGrid();
        drawApple();
        drawSnake();
    }

    function moveSnake() {
        // Create a new head object
        const newHead = { x: snake[0].x, y: snake[0].y, type: 'head' };
    
        // Update the new head position based on the direction
        switch (direction) {
            case 'up':
                newHead.y = (newHead.y - 1 + gridSize) % gridSize;
                break;
            case 'down':
                newHead.y = (newHead.y + 1) % gridSize;
                break;
            case 'left':
                newHead.x = (newHead.x - 1 + gridSize) % gridSize;
                break;
            case 'right':
                newHead.x = (newHead.x + 1) % gridSize;
                break;
        }
    
        // Check for collisions (not implemented yet)
    
        // Add the new head to the front of the snake array
        snake.unshift(newHead);
    
        // Update the type of the old head to 'body'
        if (snake.length > 1) {
            snake[1].type = 'body';
        }

        // Check for collisions with the body or walls
        if (isCollisionWithBody(newHead) || isCollisionWithWall(newHead)) {
            // Collision occurred, game over
            alert('Game Over!');
            resetGame();
            return;
        }

        if (!isCollision(snake[0], apple)) {
            // Remove the tail
            snake.pop();
            snake[snake.length - 1].type = 'tail'
        }
        else {
            generateApple();
        }
    }

    function isCollisionWithBody(newHead) {
        // Check if the new head collides with any part of the snake body
        for (let i = 1; i < snake.length; i++) {
            if (isCollision(newHead, snake[i])) {
                return true;
            }
        }
        return false;
    }
    
    function isCollisionWithWall(newHead) {
        // Check if the new head is outside the canvas boundaries
        return (
            newHead.x < 0 || newHead.x >= gridSize ||
            newHead.y < 0 || newHead.y >= gridSize
        );
    }
    
    function resetGame() {
        // snake.splice(0, snake.length)
        // startSnake = [
        //     { type: 'head', x: 5, y: 10 },
        //     { type: 'body', x: 4, y: 10 },
        //     { type: 'body', x: 3, y: 10 },
        //     { type: 'tail', x: 2, y: 10 }
        // ];
        // snake = [...startSnake];
        // apple = { x: 15, y: 10 };
        // drawApple();
        // direction = 'right';  // Reset the direction
    }
    

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    function getImageByType(type) {
        switch (type) {
            case 'head':
                return headImage;
            case 'body':
                return bodyImage;
            case 'tail':
                return tailImage;
            default:
                return null;
        }
    }

    function drawGrid() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const color = (row + col) % 2 === 0 ? '#6eff9e' : '#66cc88';
                context.fillStyle = color;
                context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
    
    setInterval(updateGame, 200); // Game loo
});
