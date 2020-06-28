// fires when the initial HTML document completely loaded
document.addEventListener('DOMContentLoaded', () => {
    // build grid
    const grid = document.querySelector(".grid");
    buildGrid();

    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartButton = document.querySelector('#start-button');
    const width = 10

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
        [1, width+1, width+2, width*2+2],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetronimo = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetronimo = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const tetronimoes = [lTetromino, zTetromino, tTetromino, oTetronimo, iTetronimo];

    // randomly select a tetronimo
    let random = Math.floor(Math.random()*tetronimoes.length)
    let currentPosition = 4;
    let currentRotation = 0;
    let current = tetronimoes[random][currentRotation];

    // draw tetronimo
    draw();

    // move tetronimo down
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
    }
    
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetronimo'); 
        })
    }
    
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetronimo'); 
        })
    }

    // assign functions to keyCodes
    function control(event) {
        if(event.keyCode === 37){
            moveLeft()
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
            // start new tetronimo falling
            random = Math.floor(Math.random() * tetronimoes.length);
            current = tetronimoes[random][currentRotation];
            currentPosition = 4
            draw()
        }
    }

    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        // if none of the squares of the tetronimo is at the edge of the grid, move left
        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1;
        }

        draw() 
    }
})