$(document).ready(function() { // 2012 TypingD JS by rexfeng

  var Game, Word;
  var _bind = function(fn, a){ return function(){ return fn.apply(a, arguments); }; };

  Game = (function() {
    function Game() 
    {
      this.keypress = _bind(this.keypress, this);
      this.update = _bind(this.update, this);
      this.start();
    }

    Game.prototype.start = function() 
    {
      this.refreshRate = 1000 / 40; // in milliseconds
      this.mapSize = 75; // length of map
      this.waitingforStart = true;
      this.gameStatus = false;

      return this.interval = setInterval(this.update, this.refreshRate);
    };

    Game.prototype.update = function() 
    {
      // game not started yet
      if ((this.waitingforStart == true) && (this.gameStatus == false)) 
      {

        var url = "waiting for start";
        location.hash = url;

      } else {
        for (var i = 0; i < 1000; i++) 
        {
          
          location.hash = "     |" + i; 
        }
      }
    };

    Game.prototype.keypress = function(event) {
      if ((this.waitingforStart == true) &&(this.gameStatus == false))
      {
        switch (event.which) 
        {
          case 78: // n
            this.waitingforStart = false;

            return this.waitingforStart;
            break;
        }
      }


    }; // end Game.prototype.keypress


  return Game;
  })();

// initialize game
  $(function() {
    var game;
    game = new Game();
    return $(document).keydown(game.keypress);
  });









}); // end doc ready