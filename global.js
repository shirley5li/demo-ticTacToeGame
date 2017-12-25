// APP设置
var MYAPP = MYAPP || {
  gameInPlay: false,
  winCombos: [//游戏一方赢时的棋子摆放位置
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3]
  ],
  playerOneScore: 0,
  playerTwoScore: 0,
  timeOuts: [],//用于设置循环
  initializeVars: function() {//初始化变量
    this.numFilledIn = 0;//表示填充的方格数目
    this.currentBoard = {//方格当前的填充情况对象
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: ''
    };
  },
  initializeGame: function() {//初始化游戏
    MYAPP.initializeVars();//初始化变量
    MYAPP.display.drawBoard();//绘画游戏面板的网格并保存在timeOuts数组对象中备用
    $('.game-choice button').click(function() {//显示游戏玩家选择界面
      MYAPP.secondPlayer = MYAPP.game.gameSelection(this);//如果选择了两个玩家，则 MYAPP.secondPlayer值为true；否则选择了一个玩家，MYAPP.secondPlayer值为false
      MYAPP.display.hideGameChoice();//隐藏游戏玩家选择界面
      MYAPP.display.showGameStarter(MYAPP.secondPlayer);//显示游戏角色选择界面
      //off()方法通常用于移除通过on()方法添加的事件处理程序，先移除角色选择按钮上的事件，再添加新的事件
      $('.game-starter .choose-x, .game-starter .choose-o').off().click(MYAPP.game.firstGame);

      $('.back-button').on('click', function() {
        MYAPP.display.hideGameStarter();
        MYAPP.display.showGameChoice();
      });
    });
    $('.hard-reset').on('click', MYAPP.game.resetGame);
  }
};
/*=========================
      Display functions
==========================*/
MYAPP.display = {
  //隐藏角色选择界面  
  hideGameStarter: function() {
  $('.game-starter').fadeOut();
},
  //游戏角色选择界面，若输入参数为true表示有两个玩家，否则只有一个玩家
  showGameStarter: function(isTwoPlayer) {
  var message;
  if (isTwoPlayer) {//两个玩家时的提示文本信息
    message = "Player 1 : Would you like X or O?"
  }
  else {//一个玩家时的提示文本信息
    message = "Would you like to be X or O?";
  }
  MYAPP.timeOuts.push(//将角色选择页面的文本提示信息显示出来，并将该函数push进timeOuts数组保存
    setTimeout(function() {
      $('.game-starter').fadeIn(500).children('p').text(message);
  }, 700));
},

  showGameChoice: function() {
  $('.game-choice').fadeIn(600);
},
  //隐藏游戏玩家选择界面
  hideGameChoice: function() {
  $('.game-choice').fadeOut(600);
},

  showPlayerOnePrompt: function() {
  if (MYAPP.secondPlayer) {
    $('.player-one-turn p').text('Go Player 1!');
  }
  else {
    $('.player-one-turn p').text('Your turn!');
  }
  $('.player-one-turn').animate({'top': '-45px'}, 500);
},
  //隐藏轮到1号玩家提示信息
  hidePlayerOnePrompt: function() {
  $('.player-one-turn').animate({'top': '0'}, 500);
},
  
  showPlayerTwoPrompt: function() {
  if (MYAPP.secondPlayer) {
    $('.player-two-turn p').text('Go Player 2!');
  }
  else {
    $('.player-two-turn p').text('Computer\'s turn');
  }
  $('.player-two-turn').animate({'top': '-45px'}, 500);
},
  //隐藏轮到2号玩家提示信息
  hidePlayerTwoPrompt: function() {
  $('.player-two-turn').animate({'top': '0'}, 500);
},

  showDrawMessage: function() {
  MYAPP.timeOuts.push(
    setTimeout(function() {
    $('.draw-message').fadeIn(500);
  }, 1500));
},

  hideDrawMessage: function() {
  $('.draw-message').fadeOut(1000);
},
  //显示玩家失败信息（玩家与电脑时）
  showLoseMessage: function() {
    MYAPP.timeOuts.push(
      setTimeout(function() {
    $('.lose-message').fadeIn(500);
}, 1500)
    );
},

  hideLoseMessage: function() {
  $('.lose-message').fadeOut(1000);
},
  //显示几号玩家获胜信息（两个玩家时）
  showWinMessage: function() {
    MYAPP.timeOuts.push(
      setTimeout(function() {
    $('.win-message').fadeIn(500).children('p').text("Player " + MYAPP.turn + " wins!! :D ")
}, 1500));
},

  hideWinMessage: function() {
  $('.win-message').fadeOut(1000);
},

  drawBoard: function() {
    MYAPP.timeOuts.push(setTimeout(function() {
    var c = document.getElementById("myCanvas");
    var canvas = c.getContext("2d");
    canvas.lineWidth = 1;//线条宽度
    canvas.strokeStyle = "#fff";//线条颜色
    //vertical lines
    canvas.beginPath();//开始绘画第一条竖线路径
    canvas.moveTo(100, 0);
    canvas.lineTo(100, 146.5);
    canvas.closePath();
    canvas.stroke();
    canvas.beginPath();//开始绘画第二条竖线路径
    canvas.moveTo(200, 0);
    canvas.lineTo(200, 146.5);
    canvas.closePath();
    canvas.stroke();

    // horizontal lines
    canvas.lineWidth = .5;

    canvas.beginPath();//开始绘画第一条横线路径
    canvas.moveTo(4, 48.5);
    canvas.lineTo(296, 48.5);
    canvas.closePath();
    canvas.stroke();
      
    canvas.beginPath();//开始绘画第一条横线路径
    canvas.moveTo(4, 98.5);
    canvas.lineTo(296, 98.5);
    canvas.closePath();
    canvas.stroke();  
  }, 1500));
},
  //追加九个li元素在.boxes后面，即画九个方格
  resetSquares: function() {
  $('.boxes').html('');
  for (var i = 1; i <= 9; i++) {
    var box = '<li class="' + i + '"><i class="letter"><span></span></i></li>';
    $(box).appendTo($('.boxes'));
  }
},
  //显示分数展示信息
  showScore: function() {
    if (MYAPP.secondPlayer) {//两个玩家时，即1号玩家和2号玩家，设置玩家名称
      $('.score-1').children('.name').text('player 1'); //children() 方法返回返回被选元素的所有直接子元素。.children(selector)
      $('.score-2').children('.name').text('player 2'); 
    }
    else {//一个玩家时，即1号玩家和电脑（2号玩家），设置玩家名称
      $('.score-1').children('.name').text('player 1'); 
      $('.score-2').children('.name').text('computer'); 
    }
    $('.score-1, .score-2').children('.points').text('0');//两位玩家初始分数设置为0
    $('.score-1,.score-2, .points-divider').fadeIn();//显示两个分数之间的管道分隔符
  },
  //更新分数
  updateScore: function(turn) {
    var currentScore = turn === 1 ? MYAPP.playerOneScore : MYAPP.playerTwoScore;

    $('.score-' + turn).children('.points').text(currentScore);
  }
};
/*=========================
      Game Logic
==========================*/
MYAPP.game = {
  //设置哪位玩家开始下第一步，随机地
  whoStarts: function() {
    var random = Math.floor(Math.random() * 2 + 1);//random随机取值1或2
    return random;
  },
  gameSelection: function(item) {//游戏玩家选择
    if ($(item).text() === 'One Player') {
      // returns what secondPlayer value to set
      return false;
    }
    else {
      return true;
    } 
  },
  //进入第一局游戏
  firstGame: function() {
    MYAPP.playerOneSymbol = $(this).text();//1号玩家选择的角色标志
    MYAPP.playerTwoSymbol = MYAPP.playerOneSymbol == 'X' ? 'O' : 'X'; //2号（电脑）玩家的角色标志
    MYAPP.turn = MYAPP.game.whoStarts();//turn随机取值1或2，表示随机开始次序
    MYAPP.display.hideGameStarter();//隐藏角色选择界面
    $('#myCanvas').animate({'opacity': '1'}, 1200);//将画布显示出来
    $('.hard-reset').fadeIn(600);//显示重置按钮
    MYAPP.display.showScore();//显示初始分数
    MYAPP.display.resetSquares();//画九个方格
    MYAPP.game.play();//开始游戏
  },
  //开始正式游戏逻辑
  play: function() {
    MYAPP.gameInPlay = true;//游戏正在进行标志
    $('.boxes li').on('click', function() {//点击某个方格事件
     MYAPP.game.playerTurn(this);
    });  
    
    MYAPP.timeOuts.push(
      setTimeout(function(){
      if (MYAPP.turn === 1) {
        MYAPP.display.showPlayerOnePrompt();
      }
      else if (MYAPP.turn === 2) {
        MYAPP.display.showPlayerTwoPrompt();
      }
    }, 1500),
    setTimeout(function() {
      if (MYAPP.turn === 2 && !MYAPP.secondPlayer) {
        MYAPP.game.computerPlay();
      }
    }, 1200));
  },
  //轮到哪位玩家的次序
  playerTurn: function(square) {
    var symbol = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;//如果随机次序是1，显示一号玩家的角色符号，否则为二号玩家角色符号
    var box = $(square).children('i').children('span');//方格元素
    if (box.text() === '' && MYAPP.gameInPlay && (MYAPP.turn === 1 || (MYAPP.turn === 2 && MYAPP.secondPlayer))) {
      box.text(symbol);//设置方格的玩家角色符号
      var number = $(square).attr('class');//number表示第几个方格
      MYAPP.game.updateSquare(number, symbol);//更新当前点击的方格的玩家角色标志
      MYAPP.game.endTurn(symbol);//判断是否结束本轮次游戏，若结束提示结果信息
    }
  },
  computerPlay: function() {
    var computer = MYAPP.computer;
    //test computer move suggestion
    var boxNumber;
    if (computer.computerWhichMove(MYAPP.game) && MYAPP.turn === 2) {
      boxNumber = computer.computerWhichMove(MYAPP.game);
      var currentBox = $('.' + boxNumber).children('i');
      
      var symbol = MYAPP.playerTwoSymbol;

      MYAPP.timeOuts.push(
        setTimeout(function() {
        currentBox.children('span').text(symbol);
        MYAPP.game.updateSquare(boxNumber, MYAPP.playerTwoSymbol);
        MYAPP.game.endTurn(symbol);
      }, 1000));
    } 
  },
  //结束本轮次，输入参数为玩家角色标志，字符'X'或'O'，注意symbol是和turn对应的，即turn=1时，symbol为1号玩家的角色标志
  endTurn: function(symbol) {
    MYAPP.numFilledIn = MYAPP.numFilledIn + 1;//填充的方格数目加1
    if (MYAPP.gameInPlay) {//游戏正在进行
      if (MYAPP.game.checkWin(symbol)[0]) {//检测该玩家是否获胜，如果该玩家获胜时
        MYAPP.game.updateScore(MYAPP.turn);//更新该玩家的分数
        if (MYAPP.secondPlayer) {//如果有两个玩家
          MYAPP.display.showWinMessage();//显示该玩家获胜信息
        }
        else {//一个玩家和电脑的情况，如果turn为1表示1号玩家获胜，显示该玩家的获胜信息，否则输给电脑，显示该玩家的失败信息
          MYAPP.turn === 1 ? MYAPP.display.showWinMessage() : MYAPP.display.showLoseMessage();
        }
        MYAPP.gameInPlay = false;//游戏正在进行置为false
        MYAPP.game.showWinningCombination();//展示获胜时的组合情况
        MYAPP.display.hidePlayerOnePrompt();//隐藏轮到1号玩家提示信息
        MYAPP.display.hidePlayerTwoPrompt();//隐藏轮到2号玩家提示信息
        MYAPP.game.reset();//本轮游戏结束后重置游戏
      }
      //当平局时，即填充的方格数>=9还没分出胜负，即达到平局
      else if (MYAPP.numFilledIn >= 9) {
        MYAPP.gameInPlay = false;//游戏正在进行标志置为false
        MYAPP.display.hidePlayerOnePrompt();//隐藏轮到1号玩家提示信息
        MYAPP.display.hidePlayerTwoPrompt();//隐藏轮到2号玩家提示信息
        MYAPP.display.showDrawMessage();//显示平局提示信息
        MYAPP.turn = MYAPP.game.whoStarts();//随机取得先下的一方
        MYAPP.game.reset();//重置游戏
      } else {//还没下满九格，无法判断输赢平局时
        if (MYAPP.turn === 1) {//当前的次序是1号玩家
          MYAPP.display.hidePlayerOnePrompt();//隐藏轮到1号玩家提示信息
          MYAPP.display.showPlayerTwoPrompt();//显示轮到2号玩家提示信息
          MYAPP.turn = 2;//将当前次序置为2号玩家
          // 如果没有第二个玩家时，执行电脑游戏逻辑computerPlay
          if (!MYAPP.secondPlayer) {
            MYAPP.game.computerPlay();
          }
        } else if (MYAPP.turn === 2) {//当前的次序是2号玩家
          MYAPP.display.hidePlayerTwoPrompt();
          MYAPP.display.showPlayerOnePrompt();
          MYAPP.turn = 1;
        }
      }
    }
  },
  //更新当前点击的方格的玩家角色标志
  updateSquare: function(number, symbol) {
    MYAPP.currentBoard[number] = symbol;
    //将角色符号标志画出来

  },
  //检查游戏是否有一方玩家获胜，输入参数为玩家角色标志，即'X'或'O'，返回是否获胜标志，如果获胜还要返回获胜时的棋子组合情况
  checkWin: function(symbol) {
    var currentBoard = MYAPP.currentBoard;//九方格面板对象
    var wins = MYAPP.winCombos;//一方获胜时的棋子的所有摆放可能，二重数组
    var winningCombo = [];
    var winner = wins.some(function(combination) {//some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”
      var winning = true;//该symbol玩家游戏获胜标志
      for (var i = 0; i < combination.length; i++) {//combination表示获胜时棋子的某一种组合情况
        if (currentBoard[combination[i]] !== symbol) {
          winning = false;
        }
      }
      //如果该玩家获胜
      if (winning) {
        winningCombo = combination;//winningCombo表示获胜时该玩家的棋子组合情况
      }
      return winning;
    });
    return [winner, winningCombo];
  },
  //展示获胜时的组合情况
  showWinningCombination: function() {
    var symbol = MYAPP.turn === 1 ? MYAPP.playerOneSymbol : MYAPP.playerTwoSymbol;
    var combo = MYAPP.game.checkWin(symbol)[1];
    for (var i = 0; i < combo.length; i++) {
      var currentBox = '.' + combo[i]; 
   // Black box and rotating test for winning combo  
        $(currentBox).children('i').addClass('win').children('span').addClass('rotate');
     }
  },
  //更新分数，输入参数为随机开始次序，即1或2
  updateScore: function(turn) {
    turn === 1 ? MYAPP.playerOneScore += 1 : MYAPP.playerTwoScore += 1; 
    
    MYAPP.display.updateScore(turn);
    
  },
  //一轮游戏结束后，重置游戏
  reset: function() {
    MYAPP.initializeVars();//初始化变量
    
    MYAPP.timeOuts.push(
      setTimeout(function() {
        MYAPP.display.hideDrawMessage();//隐藏平局信息
        MYAPP.display.hideLoseMessage();//隐藏失败信息
        MYAPP.display.hideWinMessage();//隐藏获胜信息
        $('.boxes li').fadeOut();//隐藏方格
      }, 5000),
      setTimeout(function(){
        MYAPP.display.resetSquares();//画九个方格
        $('.boxes li').fadeIn();//显示方格
        MYAPP.numFilledIn = 0;//填充的方格数置为0
      }, 6000),
    //Make sure time for next timeout is long enough
    //to not cause problems after first game
      setTimeout(function() {
        MYAPP.gameInPlay = true;//正在进行游戏标志置为true
        MYAPP.game.play();//开始游戏
      }, 6000)
      );
  },
  resetGame: function() {
    $('#myCanvas').css('opacity', '0');
    $('.hard-reset').fadeOut();
    $('.points-divider, .score-1, .score-2').fadeOut();
    MYAPP.playerOneScore = 0;
    MYAPP.playerTwoScore = 0;
    MYAPP.display.resetSquares();
    MYAPP.initializeVars();
    MYAPP.gameInPlay = false;
    MYAPP.playerOneSymbol = null;
    MYAPP.playerTwoSymbol = null;
    MYAPP.timeOuts.forEach(function(timer) {
      clearTimeout(timer);
    });
    $('.draw-message, .win-message, .lose-message').hide();
    MYAPP.display.hidePlayerOnePrompt();
    MYAPP.display.hidePlayerTwoPrompt();
    MYAPP.display.showGameChoice();
  }
};

/* End Game Logic */
  
/*================================
    Computer Move Decisions
=================================*/    

MYAPP.computer = {
  //电脑该走哪一步
  computerWhichMove: function () {
    var move = this.winOrBlockChoice('win')[0];
    if (!move) {
      move = this.winOrBlockChoice('block')[0];
      console.log(this.winOrBlockChoice('block'));
    }
    if (!move) {
      move = this.doubleThreatChoice('win');
    }
    if (!move) {
      move = this.doubleThreatChoice('block');
    }
    if (!move) {
      move = this.firstPlay();
    }
    if (!move) {
      move = this.playCenter();
    }
    if (!move) {
      move = this.emptyCorner();
    }
    if (!move) {
      move = this.emptySide();
    }
    move = (move && MYAPP.currentBoard[move]) === '' ? move : false;
    return move;
  },
  //电脑关于选择赢敌还是御敌的选择策略
  winOrBlockChoice: function(choiceType, board) {
    var board = board || MYAPP.currentBoard;//MYAPP.currentBoard方格当前的填充情况对象
    if (choiceType === 'win') {//选择赢敌时
      var currentSymbol = MYAPP.playerTwoSymbol;//currentSymbol表示当前玩家角色标志为二号玩家角色标志
      var opponentSymbol = MYAPP.playerOneSymbol;//对手玩家角色标志为1号玩家角色标志
    } else if (choiceType === 'block') {//选择御敌时
      var currentSymbol = MYAPP.playerOneSymbol;//当前玩家角色标志为1号玩家角色标志
      var opponentSymbol = MYAPP.playerTwoSymbol;//对手玩家角色标志为2号玩家角色标志
    } else {
      return;
    }
    var moves = [];//记录怎么走
    MYAPP.winCombos.forEach(function(combo) {//winCombos记录获胜时的棋子全部的组合可能
      var notFound = [];
      var notPlayer = true;
      for (var i = 0; i < combo.length; i++) {
        if (board[combo[i]] !== currentSymbol) {
          if (board[combo[i]] === opponentSymbol) {
            notPlayer = false;
          } else {
            notFound.push(combo[i]);
          }
        }
      }
      if (notFound.length === 1 && notPlayer) {
        var move = notFound[0];
        moves.push(move);
      }
    });
    return moves;
},
  //当遇到双重危险时的落棋策略
  doubleThreatChoice: function(choiceType) {
  // use winChoice function to test a spot for double threat
  var board = MYAPP.currentBoard;
  var move;

  if (choiceType === 'win') {
    var currentSymbol = MYAPP.playerTwoSymbol;
    var opponentSymbol = MYAPP.playerOneSymbol;
  } else if (choiceType === 'block') {
    var currentSymbol = MYAPP.playerOneSymbol;
    var opponentSymbol = MYAPP.playerTwoSymbol;
  }

  // forced diagonal win on 4th move prevention
    if (board[5] === currentSymbol && MYAPP.numFilledIn === 3) {
      if ((board[1] === opponentSymbol && board[9] === opponentSymbol) || (board[3] === opponentSymbol && board[7] === opponentSymbol)) {
        // Play an edge to block double threat
        move = this.emptySide();
      }
    }
  
    if (!move && board[5] === opponentSymbol && MYAPP.numFilledIn === 2) {
      move = this.diagonalSecondAttack();
    }

  if (!move) {
    // clone current board;
    var testBoard = $.extend({}, board);
    for (var i = 1; i <= 9; i++) {

      testBoard = $.extend({}, board);
      if (testBoard[i] === '') {
        testBoard[i] = currentSymbol;
        if (this.winOrBlockChoice(choiceType, testBoard).length >= 2) {
          move = i;
        }
      }
    }
  }
  return move || false;
},

  diagonalSecondAttack: function() {
  var board = MYAPP.currentBoard;
  var comp = MYAPP.playerTwoSymbol;
  var corners = [1,3,7,9];
  for (var i = 0; i < corners.length; i++) {
    if (board[corners[i]] === comp) {
      return 10 - corners[i];
    }
  }
},

  firstPlay: function() {
  var board = MYAPP.currentBoard;
  var corners = [1, 3, 7, 9];
  var move;
  if (MYAPP.numFilledIn === 1) {
    // player plays center
    if (board[5] === MYAPP.playerOneSymbol) {
      var cornerNum = Math.floor(Math.random() * 4 + 1);
      move = [1, 3, 7, 9][cornerNum];
    }
    //player plays corner, play opposite corner
    else {
      for (var i = 0; i < corners.length; i++) {
        if (MYAPP.currentBoard[corners[i]] === MYAPP.playerOneSymbol) {
          move = 5;
        }
      }
    }
  } else if (MYAPP.numFilledIn === 0) {
    var cornerNum = Math.floor(Math.random() * corners.length + 1);
    move = corners[cornerNum];
  }
  return move ? move : false;
},
  
  playCenter: function() {
    if (MYAPP.currentBoard[5] === '') {
      return 5;
    }
  },
  emptyCorner: function() {
  var board = MYAPP.currentBoard;
  var corners = [1, 3, 7, 9];
  var move;
  for (var i = 0; i < corners.length; i++) {
    if (board[corners[i]] === '') {
      move = corners[i];
    }
  }
  return move || false;
},

  emptySide: function() {
  var sides = [2, 4, 6, 8];
  for (var i = 0; i < sides.length; i++) {
    if (MYAPP.currentBoard[sides[i]] === '') {
      return sides[i];
    }
  }
  return false;
}
}

/* End Computer Move Decisions */  

$(document).ready(function() {  
  MYAPP.initializeGame();
});

/* end game initialization */
