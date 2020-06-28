// fires when the initial HTML document completely loaded
document.addEventListener('DOMContentLoaded', () => {
    // build grid
    const grid = document.querySelector(".grid");
    const minigrid = document.querySelector(".mini-grid");
    buildGrid();

    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartButton = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;

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

    // move tetromino down
    timerId = setInterval(moveDown, 1000)

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
        })
    }
    
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino'); 
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
    const displaySquares = document.querySelectorAll('.minigrid div');
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
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }
})