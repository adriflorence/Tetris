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

    let config = initialiseGame();

    let nextRandom = 0;
    let timerId;
    let highscore = 0;
    const width = 10;

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


    // randomly select a tetromino
    let random = Math.floor(Math.random()*tetrominoes.length)
    let currentPosition = 4;
    let currentRotation = 0;
    let current = tetrominoes[random][currentRotation];

    // draw tetromino
    draw();


    /////// METHODS ////////

    function initialiseGame(){
        // build grid
        let grid_object = {};
        let initialiser = buildGrid(grid_object);

        initialiser.squares = Array.from(document.querySelectorAll('.grid div'));
        initialiser.game_over = false;
        initialiser.score = 0;
        initialiser.level = 1;
        initialiser.speed = 1000;

        return initialiser;
    }

    function buildGrid(grid_object) {
        let grid = document.querySelector(".grid");
        let minigrid = document.querySelector(".mini-grid");

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

        grid_object.grid = grid;
        grid_object.minigrid = minigrid;
        return grid_object;
    }
    
    function draw() {
        current.forEach(index => {
            config.squares[currentPosition + index].classList.add('tetromino');
            config.squares[currentPosition + index].style.backgroundColor = colours[random];
        })
    }
    
    function undraw(){
        current.forEach(index => {
            config.squares[currentPosition + index].classList.remove('tetromino'); 
            config.squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    // assign functions to keyCodes
    function control(event) {
        if(!config.game_over){
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
        if(config.game_over == false) {
            undraw()
            currentPosition += width
            draw()
            freeze()
        }
    }

    function drop(){
        undraw()
        while(!current.some(index => config.squares[currentPosition + index + width].classList.contains('taken'))) {
            currentPosition += width
        }
        draw()
        freeze()
    }

    // freeze tetromino when it gets to the bottom of the grid
    function freeze(){
        if(current.some(index => config.squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => config.squares[currentPosition + index].classList.add('taken'))
            // start new tetromino falling

            if(!config.game_over){
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

        if(current.some(index => config.squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1;
        }
        draw() 
    }

    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        // if none of the squares of the tetromino is at the edge of the grid, move right
        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => config.squares[currentPosition + index].classList.contains('taken'))){
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

    // show up-next tetromino in mini-grid display
    displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], // L
        [0, displayWidth, displayWidth+1, displayWidth*2+1], // Z
        [1, displayWidth, displayWidth+1, displayWidth+2], // T
        [0, 1, displayWidth, displayWidth+1], // O
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // I
    ]

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
            timerId = setInterval(moveDown, config.speed);
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
        let config = initialiseGame();
        console.log('game restarted');
        
        // display start/pause button
        startButton.style.display = "block";
        startButton.innerHTML = "START";

        config.squares = Array.from(document.querySelectorAll('.grid div'));
        displaySquares = document.querySelectorAll('.mini-grid div');

        config.game_over = false
        timerId = null
    }

    function addScore(){
        for(let i = 0; i < 199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => config.squares[index].classList.contains('taken'))){ // if every square in a row is taken
                // increment and display score
                config.score += 10
                scoreDisplay.innerHTML = config.score

                // increment level
                if(config.score % 100 == 0){
                    incrementLevel();
                }

                // remove squares
                row.forEach(index => {
                    config.squares[index].classList.remove('taken');
                    config.squares[index].classList.remove('tetromino');
                    config.squares[index].style.backgroundColor = '';

                });
                const squaresRemoved = config.squares.splice(i, width);
                config.squares = squaresRemoved.concat(config.squares);
                config.squares.forEach(cell => config.grid.appendChild(cell));
            }
        }
    }

    function incrementLevel(){
        config.level = Math.round(config.score / 100) + 1
        levelDisplay.innerHTML = config.level
        incrementSpeed();
    }

    function incrementSpeed(){
        config.speed = 1000 + (config.level * 250);
        speedDisplay.innerHTML = config.speed;
        timerId = setInterval(moveDown, config.speed);
    }

    function gameOver(){
        if(current.some(index => config.squares[currentPosition + index].classList.contains('taken'))){
            config.game_over = true;
            clearInterval(timerId); // stop auto move down
            alert.style.display = "block";
            startButton.style.display = "none";
            if(config.score > highscore){
                highScoreDisplay.innerHTML = config.score
                highscore = config.score
            }
        }
    }
})