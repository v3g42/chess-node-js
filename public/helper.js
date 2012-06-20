$(document).ready(function () {
    // define the constants
    baseX = 0.5, baseY = 0.5, width = 50,margin=8;
    // get the 2D context from the "chessboard" canvas
    canvas =  document.getElementById("chessboardCanvas");
    context = canvas.getContext("2d");
    pieces =['B','K','N','P','Q','R'];
    white=[],black=[];
    loaded=0;
    flag=false;
    dragok = false;
    moved = null;
     movx= 0,movy=0;
    prev_pos = null;
    // draws a chessboard
    window.drawChessboard = function (){
        // draws the 8 by 8 chessboard
        // k represents the Squares id in chess.js
        if(flag)
          return;
        flag = true;
        clearCanvas(context,canvas);
        var k=0;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++,k++) {
                var x = baseX + width * j, y = baseY + width * i;

                // draw the rectangle
                context.strokeRect(x, y, width, width);

                // fill the odd number rectangles
                if ((i + j) % 2 != 0) {
                    context.fillRect(x, y, width, width);
                }
                var piece = chess.get(chess.SQUARES[k]);
                var x = baseX + width * j+margin, y = baseY + width * i+margin;
                if(piece && (piece!=moved))
                  drawPiece(piece,x,y);
            }
        }
        draw_moving();
        flag=false;
    }

    window.drawPiece = function(piece,x,y){


            var arr = (piece.color == "w") ? white : black;
            var image = arr[piece.type.toUpperCase()];
            if(image){
            image.width = width-margin*2;
            image.height = width-margin*2;
            context.drawImage(image, x, y);
            }
    }

    function draw_moving(){
        if(dragok){
            drawPiece(moved,movx,movy);
        }
    }

    function loadImages(){
        for(var i=0;i<pieces.length ; i++){
            var img = new Image();
            img.src="images/Blue%20" + pieces[i]+".png";
            img.onload = function() {
               drawChessboard();
            };
            white[pieces[i]]  = img;
            img = new Image();
            img.onload = function() {
               drawChessboard();
            };
            img.src="images/Green%20" + pieces[i]+".png";
            black[pieces[i]]  = img;

        }
    }
    function clearCanvas(context, canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      var w = canvas.width;
      canvas.width = 1;
      canvas.width = w;
    }
    function myMove(e){
     if (dragok){
      movx = e.pageX - canvas.offsetLeft;
      movy = e.pageY - canvas.offsetTop;
     }
    }

    function myDown(e){
        prev_pos = get_square(e);
      var piece = chess.get(prev_pos);
      if(piece){
        dragok = true;
        moved =piece;
        canvas.onmousemove = myMove;
      }

    }
    function get_square(e){
        var x = e.pageX - canvas.offsetLeft;
              var y = e.pageY - canvas.offsetTop;
              var ix = Math.floor(x/width);
              var iy = Math.floor(y/width);
              var pos = 8 * iy + ix;
        return  chess.SQUARES[pos];
    }

    function myUp(e){
      var next_pos = get_square(e);
     dragok = false;
     canvas.onmousemove = null;
     moved=null;
     chess.move({from : prev_pos, to : next_pos});
    }
    chess = new Chess();
    loadImages();
    setInterval(drawChessboard, 10);
    //setInterval(play_random, 500);
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;

    function play_random(){
    if (!chess.game_over()) {
      console.log('position: ' + chess.fen());
      var moves = chess.moves();
      var move = moves[Math.floor(Math.random() * moves.length)];
      chess.move(move);

      console.log('move: ' + move);
    }
    }


});
