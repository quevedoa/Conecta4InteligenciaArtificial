// 0 red y 1 blue
var xhttp = new XMLHttpRequest();

rad = 50
turn = 0
lastMove = [-1,-1]
winner = 0

// 0: PvC, 1: PvP, 2: CvC
gameMode = 0

if (gameMode == 0) {
  fichaPlayer = 0; // Puede ser 0 o 1
}

nRows = 6
nCols = 7

canvasWidth = rad * 2 * nCols
canvasHeight = rad * 2 * nCols + 80
amount = [0, 0, 0, 0, 0, 0, 0]
currentColor = [200, 0]

grid = []
matrizJuego = [] // String con 42 caracteres, Se divide en 7 partes, cada una una columna, el orden de elementos va de arriba hacia abajo
for (i = 0; i < nRows; i++) {
  row = []
  for (j = 0; j < nCols; j++) {
    row.push(-1)
    matrizJuego.push(0)
  }
  grid.push(row)
}

var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(canvasWidth, canvasHeight);
  centerCanvas();
  background("#fffdf4");
}

function windowResized() {
  centerCanvas();
}

function draw() {
  background("#fffdf4");
  turnColor = color("#ea5656")
  // turnColor = color(currentColor[0], 0, currentColor[1])

  if(checkWin()) {
    winner = 1
    gameOver()
  }
  drawBoard()

  fill(turnColor)

  if ((gameMode == 0 && turn == fichaPlayer) || gameMode == 1) {
    circle(xPosTop(mouseX), rad, rad * 2)
  }
}

function drawBoard() {
  strokeWeight(3)
  fillColor = color("#fffdf4")

  for (i = 0; i < nRows; i++) {
    for (j = 0; j < nCols; j++) {
      switch(grid[i][j]) {
        case -1:
          fillColor = color("#fffdf4")
          break
        case 0:
          fillColor = color("#ea5656")
          break
        case 1:
          fillColor = color("#595be5")
          break
        case 2:
          fillColor = color("#82d15e")
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
  if(mouseX < -200 || mouseY < 20) {
    return
  }

  col = whichCol(mouseX);
  a = amount[col]
  if (a <= 5 && turn == fichaPlayer) {
    lastMove = [a, col]
  
    oppResponse(col);
  
    // xhttp.open("GET", "grid"+"?"+"lastMove="+lastMove);
  
    mat = ""
    for (i = 0; i < matrizJuego.length; i++) {
      mat = mat + matrizJuego[i]
    }
  
    stringMatrizJuego = "'( "
    for (i = 0; i < 7; i++) {
        stringMatrizJuego = stringMatrizJuego + "("
        for (j = 0; j < 6; j++) {
            stringMatrizJuego = stringMatrizJuego + " " + mat[6*i+j]
        }
        stringMatrizJuego = stringMatrizJuego + ") "
    }
    stringMatrizJuego = stringMatrizJuego + ")"
    stringMatrizJuego = stringMatrizJuego.replaceAll('2','-1').replaceAll(' 0','')
 
    xhttp.open("GET", "grid"+"?"+"lastMove="+stringMatrizJuego);
    xhttp.send();
  
    rand = Math.floor((Math.random() * 6));
    // oppResponse(rand)
  
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var fullResp = this.responseText;
        var resp = fullResp.replace('[','').replace(']','').replaceAll('"','').split(',');
  
  
        print(this.responseText)
  
        c = parseInt(resp[0])
        console.log(c + "GOLA")
  
        oppResponse(c)
      }
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

function oppResponse(col) {

  row = amount[col]

  if (row <= 5) { // Checa si la columna ya se lleno
    print("LLEGUE" + col)
    if (winner == 0) {
      if (currentColor[0] == 255) {
        currentColor[0] = 0
        currentColor[1] = 255
      } else {
        currentColor[0] = 255
        currentColor[1] = 0
      }

      grid[nRows - row - 1][col] = turn

      newCol = col*6
      newRow = (nRows-1) - row

      if (turn == 0) {
        newTurn = 1
      } else {
        newTurn = 2
      }
      matrizJuego[newCol+newRow] = newTurn

      lastMove = [row, col]
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
