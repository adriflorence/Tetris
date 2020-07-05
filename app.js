// fires when the initial HTML document completely loaded
document.addEventListener('DOMContentLoaded', () => {
    // build grid
    const grid = document.querySelector(".grid");
    const minigrid = document.querySelector(".mini-grid");
    buildGrid();

    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const levelDisplay = document.querySelector('#level');
    const speedDisplay = document.querySelector('#speed');
    const startButton = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let level = 1;
    let speed = 1000;
    const colours = [
        '#ff962e',
        '#ff005d',
        '#1900d4',
        '#9ACD32',
        '#0073ff'
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

    function buildGrid() {
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
        if(event.keyCode === 37){
            moveLeft()
        } else if(event.keyCode === 38) {
            rotate()
        } else if(event.keyCode === 39) {
            moveRight()
        } else if(event.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)
    
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze tetromino when it gets to the bottom of the grid
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tetrominoes.length);
            current = tetrominoes[random][currentRotation];
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            incrementLevel()
            gameOver()
        }
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
        // if none of the squares of the tetromino is at the edge of the grid, move left
        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1;
        }
        draw() 
    }

    function rotate(){
        undraw()
        currentRotation++
        // if current rotation gets to 4 make it go back to 0
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = tetrominoes[random][currentRotation]
        draw()
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
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

    startButton.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, speed)
            nextRandom = Math.floor(Math.random()*tetrominoes.length)
            displayShape()
        }
    })

    function addScore(){
        for(let i = 0; i < 199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))){ // if every square in a row is taken
                // increment and display score
                score += 10
                scoreDisplay.innerHTML = score
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
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'END';
            clearInterval(timerId); // stop auto move down 
        }
    }
})