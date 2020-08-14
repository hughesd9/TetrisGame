document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colours = [
    'orange',
    'red',
    'purple',
    'green',
    'yellow'
  ]

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
  let current = tetrominoes[random][currentRotation]

  //draw the tetrominoes
  function draw() {
    current.forEach(index => {
      squares[currentPos + index].classList.add('tetromino')
      squares[currentPos + index].style.backgroundColor = colours[random]
    })
  }

  //undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPos + index].classList.remove('tetromino')
      squares[currentPos + index].style.backgroundColor = ''
      })
  }

  //make the tetrominoes drop
  //timerId = setInterval(moveDown, 1000)

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
      addScore()
      gameOver()
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
  const displayIndex = 0

  //default tetrominoes
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //l tetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //z tetromino
    [0, 1, displayWidth, displayWidth+1], //square tetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //t tetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //line tetromino
  ]

  //display shape in mini grid
  function displayShape() {
    //remove shape from grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
    })
  }

  //add functionality to button
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*tetrominoes.length)
      displayShape()
    }
  })

  //Delete a row once it is full, add to score, move the rows down
  //add score
  function addScore() {
    for(let i = 0; i < 199; i += width){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))){
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPos + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
