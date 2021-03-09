// 0 red y 1 blue

rad = 25
turn = 0
lastMove = [-1,-1]
winner = 0

nRows = 6
nCols = 7

canvasWidth = rad * 2 * nCols
canvasHeight = rad * 2 * nCols + 80
amount = [0, 0, 0, 0, 0, 0, 0]
currentColor = [255, 0]

grid = []
for (i = 0; i < nRows; i++) {
  row = []
  for (j = 0; j < nCols; j++) {
    row.push(-1)
  }
  grid.push(row)
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background(255,0,255);
  turnColor = color(currentColor[0], 0, currentColor[1])

  if(checkWin()) {
    winner = 1
    gameOver()
  }
  drawBoard()

  fill(turnColor)
  circle(xPosTop(mouseX), rad, rad * 2)

}

function drawBoard() {
  fillColor = color(255, 255, 255)

  for (i = 0; i < nRows; i++) {
    for (j = 0; j < nCols; j++) {
      switch(grid[i][j]) {
        case -1:
          fillColor = color(255, 255, 255)
          break
        case 0:
          fillColor = color(255, 0, 0)
          break
        case 1:
          fillColor = color(0, 0, 255)
          break
        case 2:
          fillColor = color(0,255,0)
          break
        default:
          fillColor = color(128,128,128)
      }
      if (grid[i][j] == -1) {
      } else if (grid[i][j] == 0) {
        
      } else if (grid[i][j] == 1) {
        
      }
      fill(fillColor)
      circle(rad + j * rad * 2, rad + (i + 1) * rad * 2, rad * 2)
    }
  }
}

function chkLine(a,b,c,d) {
    // Check first cell non-zero and all cells match
    return ((a != -1) && (a == b) && (a == c) && (a == d));
}

function checkWin() {
    var a, b, c, d
    // Check down
    for (r = 0; r < 3; r++)
        for (c = 0; c < 7; c++) {
            if (chkLine(grid[r][c],grid[r+1][c],grid[r+2][c],grid[r+3][c])) {
                grid[r][c] = 2
                grid[r+1][c] = 2
                grid[r+2][c] = 2
                grid[r+3][c] = 2
                return true
            }
        }


    // Check right
    for (r = 0; r < 6; r++)
        for (c = 0; c < 4; c++) {
            if (chkLine(grid[r][c], grid[r][c+1], grid[r][c+2], grid[r][c+3])) {
                grid[r][c] = 2
                grid[r][c+1] = 2
                grid[r][c+2] = 2
                grid[r][c+3] = 2
                return true
            }
        }

    // Check down-right
    for (r = 0; r < 3; r++)
        for (c = 0; c < 4; c++) {
            if (chkLine(grid[r][c], grid[r+1][c+1], grid[r+2][c+2], grid[r+3][c+3])) {
                grid[r][c] = 2
                grid[r+1][c+1] = 2
                grid[r+2][c+2] = 2
                grid[r+3][c+3] = 2
                return true
            }
        }

    // Check down-left
    for (r = 3; r < 6; r++)
        for (c = 0; c < 4; c++) {
            if (chkLine(grid[r][c], grid[r-1][c+1], grid[r-2][c+2], grid[r-3][c+3])) {
                grid[r][c] = 2
                grid[r-1][c+1] = 2
                grid[r-2][c+2] = 2
                grid[r-3][c+3] = 2
                return true
            }
        }
    return false
}

function gameOver() {
  textSize(32);
  text('Game Over', 100, rad*2 + rad*2*7);
}

function mouseClicked() {
  col = whichCol(mouseX)
  a = amount[col]

  if (a <= 5) { // Checa si la columna ya se lleno
    print(lastMove)
    if (winner == 0) {
      if (currentColor[0] == 255) {
        currentColor[0] = 0
        currentColor[1] = 255
      } else {
        currentColor[0] = 255
        currentColor[1] = 0
      }

      grid[nRows - a - 1][col] = turn
      lastMove = [a, col]
      if (turn == 1) {
        turn = 0
      } else {
        turn = 1
      }
      amount[col] = amount[col] + 1

    } else {
      gameOver()
    }
  }
}

function whichCol(posX) {
  pos = xPosTop(posX)
  h = canvasWidth / nCols
  return ((pos - rad) / h)
}

function xPosTop(posX) {
  h = canvasWidth / nCols
  pos = rad

  // for (i = nRows; i >= 0; i--) {
  //   if (posX >= h*i) {
  //     pos = pos + (h*i)
  //   }
  //   break
  // }

  if (posX >= h * nRows) {
    pos = pos + (h * 6)
  } else if (posX >= h * 5) {
    pos = pos + (h * 5)
  } else if (posX >= h * 4) {
    pos = pos + (h * 4)
  } else if (posX >= h * 3) {
    pos = pos + (h * 3)
  } else if (posX >= h * 2) {
    pos = pos + (h * 2)
  } else if (posX >= h * 1) {
    pos = pos + (h * 1)
  } else if (posX >= 0) {
    pos = pos
  }
  return pos
}
