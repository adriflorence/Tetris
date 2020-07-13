// fires when the initial HTML document completely loaded
document.addEventListener('DOMContentLoaded', () => {

    // buttons and divs
    const startButton = document.querySelector('#start-button');
    const restartButton = document.querySelector('#restart-button');
    const scoreDisplay = document.querySelector('#score');
    const levelDisplay = document.querySelector('#level');
    const speedDisplay = document.querySelector('#speed');
    const highScoreDisplay = document.querySelector('#high-score');
    let alert = document.querySelector('#alert');
    const closeAlertButton = document.querySelector('#close-alert');

    let grid = document.querySelector(".grid");
    let minigrid = document.querySelector(".mini-grid");

    let squares = Array.from(document.querySelectorAll('.grid div'));
    let game_over = false;
    let score = 0;
    let level = 1;
    let speed = 1000;
    let highscore = 0;
    const width = 10;
    let timerId = null;
    let currentRotation = 0;
    let currentPosition = 4;

    initialiseGame();

    // mini-grid display
    let displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const colours = [
        '#ff962e',
        '#ff005d',
        '#1900d4',
        '#9ACD32',
        '#21d6ff'
    ]

    // Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    // initialises tetronimos' first rotation for mini-grid
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], // L
        [0, displayWidth, displayWidth+1, displayWidth*2+1], // Z
        [1, displayWidth, displayWidth+1, displayWidth+2], // T
        [0, 1, displayWidth, displayWidth+1], // O
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // I
    ]

    // launch first tetromino
    let nextRandom = Math.floor(Math.random() * tetrominoes.length);
    let random = nextRandom;
    launchNewTetromino();


    /////// METHODS ////////

    function initialiseGame(){
        // build grid
        buildGrid();

        squares = Array.from(document.querySelectorAll('.grid div'));
        game_over = false;
        score = 0;
        level = 1;
        speed = 1000;
        timerId = null;
        currentRotation = 0;
        currentPosition = 4;

        scoreDisplay.innerHTML = score;
        levelDisplay.innerHTML = level;
        speedDisplay.innerHTML = speed;

        console.log('game initialised')
    }

    function buildGrid() {
        // if not first game, clear and rebuild grid
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        while (minigrid.firstChild) {
            minigrid.removeChild(minigrid.firstChild);
        }
        
        for(let i = 0; i < 200; i++) {
            let div = document.createElement("div");
            grid.appendChild(div);
        }
        for(let i = 0; i < 10; i++) {
            let div = document.createElement("div");
            div.classList.add('taken');
            grid.appendChild(div);
        }
        // minigrid
        for(let i = 0; i < 16; i++) {
            let div = document.createElement("div");
            minigrid.appendChild(div);
        }
    }
    
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colours[random];
        })
    }
    
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino'); 
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    // assign functions to keyCodes
    function control(event) {
        if(!game_over){
            if(event.keyCode === 37){
                moveLeft()
            } else if(event.keyCode === 38) {
                rotate()
            } else if(event.keyCode === 39) {
                moveRight()
            } else if(event.keyCode === 40) {
                moveDown()
            } else if(event.keyCode === 32) { // space
                drop()
            }
        }
    }
    document.addEventListener('keyup', control)
    
    function moveDown(){
        if(game_over == false) {
            undraw()
            currentPosition += width
            draw()
            freeze()
        }
    }

    function drop(){
        undraw()
        while(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            currentPosition += width
        }
        draw()
        freeze()
    }

    // freeze tetromino when it gets to the bottom of the grid
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            // start new tetromino falling
            if(!game_over){
                launchNewTetromino();
            }
        }
    }

    function launchNewTetromino(){
        random = nextRandom
        nextRandom = Math.floor(Math.random() * tetrominoes.length);
        current = tetrominoes[random][currentRotation];
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }

    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        // if none of the squares of the tetromino is at the edge of the grid, move left
        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1;
        }
        draw() 
    }

    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        // if none of the squares of the tetromino is at the edge of the grid, move right
        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1;
        }
        draw() 
    }

    function rotate(){
        undraw()
        let newRotation = currentRotation + 1
        // if new rotation gets to 4 make it go back to 0
        if(newRotation === current.length){
            newRotation = 0
        }
        newTetromino = tetrominoes[random][newRotation]

        // if new rotation of tetromino would move it over the edge of the grid, do not rotate
        const wouldBeOverTheEdge = newTetromino.some(index => (currentPosition + index) % width === 0) && newTetromino.some(index => (currentPosition + index) % width === width-1)

        // if not, draw new rotation
        if(!wouldBeOverTheEdge){
            currentRotation = newRotation
        }
        current = tetrominoes[random][currentRotation]
        draw()
    }

    // display the shape in the mini-grid display
    function displayShape(){
        displaySquares.forEach(square => { // remove tetromino class from the WHOLE mini-grid
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom];
        })
    }

    // start/stop toggle
    startButton.addEventListener('click', () => {
        // stop game
        if(timerId){
            clearInterval(timerId)
            startButton.innerHTML = 'RESUME';
            timerId = null
        // start/resume game
        } else {
            draw()
            startButton.innerHTML = 'STOP';
            timerId = setInterval(moveDown, speed);
            nextRandom = Math.floor(Math.random()*tetrominoes.length)
            displayShape()
        }
    })

    closeAlertButton.addEventListener('click', () => {
        alert.style.display = "none";
    })

    // restart game
    restartButton.addEventListener('click', restartGame);

    function restartGame(){
        initialiseGame();
        
        // display start/pause button
        startButton.style.display = "block";
        startButton.innerHTML = "START";

        squares = Array.from(document.querySelectorAll('.grid div'));
        displaySquares = document.querySelectorAll('.mini-grid div');

        game_over = false
        console.log('game restarted');
    }

    function addScore(){
        for(let i = 0; i < 199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))){ // if every square in a row is taken
                // increment and display score
                score += 10
                scoreDisplay.innerHTML = score

                // increment level
                if(score % 100 == 0){
                    incrementLevel();
                }

                // remove squares
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';

                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function incrementLevel(){
        level = Math.round(score / 100) + 1
        levelDisplay.innerHTML = level
        incrementSpeed();
    }

    function incrementSpeed(){
        speed = 1000 + (level * 250);
        speedDisplay.innerHTML = speed;
        timerId = setInterval(moveDown, speed);
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            game_over = true;
            clearInterval(timerId); // stop auto move down
            alert.style.display = "block";
            startButton.style.display = "none";
            if(score > highscore){
                highScoreDisplay.innerHTML = score
                highscore = score
            }
        }
    }
})