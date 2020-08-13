document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const ScoreDisplay = document.querySelector('#score')
  const StartButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0

  //console.log(squares)

  //Creating the Tetris shapes (Tetrominoes)
  //Shapes can be rotated around 4 times
  //Need to create array with the 4 possible positions that each shape can be in
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

  const squareTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const lineTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const tetrominoes = [lTetromino, zTetromino, squareTetromino, tTetromino, lineTetromino]

  let currentPos = 4
  let currentRotation = 0
  //randomely select a tetromino and its rotation
  let random = Math.floor(Math.random()*tetrominoes.length)
  let current = tetrominoes[random][0]

  //draw the tetrominoes
  function draw() {
    current.forEach(index => {
      squares[currentPos + index].classList.add('tetromino')
    })
  }

  //undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPos + index].classList.remove('tetromino')
      })
  }

  //make the tetrominoes drop
  timerId = setInterval(moveDown, 1000)

  //check for when a key is pressed
  function control(e) {
    if(e.keyCode === 37){
      moveLeft()
    }else if (e.keyCode === 38){
      rotate()
    }else if (e.keyCode === 39){
      moveRight()
    }else if (e.keyCode === 40){
      moveDown()
    }
  }
  document.addEventListener('keyup',control)

  function moveDown() {
    undraw()
    currentPos += width
    draw()
    freeze()
  }

  //freeze the tetromino
  function freeze() {
    if(current.some(index => squares[currentPos + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPos + index].classList.add('taken'))
      //create a new tetromino to fall
      random = nextRandom
      nextRandom = Math.floor(Math.random()*tetrominoes.length)
      current = tetrominoes[random][currentRotation]
      currentPos = 4
      draw()
      displayShape()
    }
  }

  //move the tetromino left so long as there is nothing blocking it
  //if the tetromino is in an array position that is a ends in 0 it cannot move left anymore
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => [currentPos + index] % width === 0)

    if(!isAtLeftEdge) currentPos -= 1

    if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
      currentPos +=1
    }
    draw()
  }

  //move the tetromino right so long as there is nothing blocking it
  //if the tetromino is in an array position that is a multiple of 9 (or l less than the edge) it cannot move right anymore
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPos + index) % width === width - 1)

    if(!isAtRightEdge) currentPos += 1

    if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
      currentPos -=1
    }
    draw()
  }

  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation++
    if(currentRotation === current.length){ //rotate shape back to original position if current rotation = 4
      currentRotation = 0
    }
    current = tetrominoes[random][currentRotation]
    draw()
  }

  //show the next tetromino in the mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //l tetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //z tetromino
    [0, 1, displayWidth, displayWidth+1], //square tetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //t tetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //line tetromino
  ]

  //display shpe in mini grid
  function displayShape() {
    //remove shape from grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }
})
