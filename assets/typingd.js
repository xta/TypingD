$(document).ready(function () { // 2012 TypingD.js by @rexfeng

  var Game;
  var _bind = function (fn, a) {
    return function () {
      return fn.apply(a, arguments);
    };
  };

  Game = (function () {

    function Game() {
      this.keypress = _bind(this.keypress, this);
      this.update = _bind(this.update, this);
      this.start();
    }

    // set variables for start of new game
    Game.prototype.start = function () {

      this.mapSize = 75; // length of map
      this.buffer = 10; // set # of spaces between spawns

      this.refreshRate = 1000 / 60; // in milliseconds
      this.delayCounter = 0; // current delay counter
      this.delayMax = 9; // warning: this line is key, it can break code

      this.spawnsPerWave = 10; // set # of words per wave
      this.totalWaves = 3;
      this.currentWave = 1;

      this.gameStatus = false;
      this.buildLoadingMsg("Press (n) key to start.");

      return this.update();
    };

    // builder builds the url hash array at start of each wave
    Game.prototype.builder = function () {
      this.url = [];
      var words = this.wordBank();

      // build background before words start
      for (var i = 0; i < (this.mapSize - 1); i++) {
        this.url.push("-");
      }

      // for each word
      for (var j = 0; j < words.length; j++) {

      // build the word, letter by letter
      for (var _j = 0; _j < words[j].length; _j++) {
        this.url.push(words[j].charAt(_j));
      }

      // append the buffer "-" separator between words
        if (j !== (words.length)) {
          for (var _k = 0; _k < this.buffer; _k++) {
            this.url.push("-");
          }
        }
      }
      return this.url;
    };

    // builds loading message for when game mode is not running
    Game.prototype.buildLoadingMsg = function (phrase) {

      this.url = [];
      var bufferSize = 0;
      if ((this.mapSize - 10) > phrase.length) {
        bufferSize += (this.mapSize - phrase.length);
      } else {
        bufferSize += 10;
      }

      // add "-" bufferSize before phrase
      for (var x = 0; x < bufferSize; x++) {
        this.url.push('-');
      }

      // add phrase
      for (var y = 0; y < phrase.length; y++) {
        this.url.push(phrase.charAt(y));
      }

      return this.url;
    };

    // get the first letter position in array (non "-")
    Game.prototype.detectFirst = function () {

      var firstPosition = 999; // set dummy
      for (var x = 0; x < this.url.length; x++) {
        if (this.url[x] !== "-") {
          firstPosition = x;
          break;
        }
      }

      return firstPosition;
    };

    Game.prototype.deleteChar = function () {
      
      var first = this.detectFirst();

      if (first !== 999) {
        this.url[first] = "-";
      }
    };

    // if visible map is all "-", then reduce array by First Position - MapSize
    Game.prototype.skipNext = function (cut) {
      for (var x = 0; x < cut; x++) {
        var move = this.url.shift();
        this.url.push(move);
      }
    };

    // moves the current loop (game or message) 1 space, with built-in slowdown
    Game.prototype.loopNext = function () {

      if (this.delayCounter == 0) {
        var move = this.url[0];
        this.url.shift();
        this.url.push(move);
        this.delayCounter = this.delayMax;
      } else {
        this.delayCounter -= 1;
      }

      return this.url;
    };

    // ***controls state of gameplay
    Game.prototype.update = function () {

      // if game==true, then check current map status (by getting closest/left char position)
      if (this.gameStatus == true) {

        var firstPosition = this.detectFirst();

        // if no piece on board for all positions
        if (firstPosition == 999) {

          // +1 to current wave number, change wave configs, start new wave && set the trigger key
            this.currentWave += 1;
            this.delayMax -= 2; // warning: this line is key, it can break code
            this.spawnsPerWave += 5;
            this.builder();
            this.triggerKey = this.keycodeMap(this.url[this.detectFirst()]);

          // check if current wave == max wave +1, then WINNING game over
          if (this.currentWave == (this.totalWaves + 1)) {
            this.gameStatus = false;
            this.buildLoadingMsg("The end! You won. :D Press (n) to play again.");
          }
        
        // else if there are any pieces on board within map size
        } else if (firstPosition <= this.mapSize) {

          // if yes && closest character is at 0, then LOSING game over
          if (firstPosition == 0) {
            this.gameStatus = false;
            this.buildLoadingMsg("Game over! :( Press (n) to restart.");

          // else do nothing && set the trigger key
          } else {
            this.triggerKey = this.keycodeMap(this.url[this.detectFirst()]);
          }
        
        // else, trim the board && set the trigger key
        } else {
          var cut = this.detectFirst() - this.mapSize;
          this.skipNext(cut);
          this.triggerKey = this.keycodeMap(this.url[this.detectFirst()]);
      }

      // else if game!=true, set defaults for new game
      } else {
        this.currentWave = 1;
        this.delayMax = 9;
        this.spawnsPerWave = 10;
      }

      // loop current state
        this.loopNext();
        location.hash = this.url.slice(0, this.mapSize).join("");

      // infinite loop controls
        var timeDelay;
        var that = this;
        var loopMethod = function () {
          that.update();
        }
        timeDelay = window.setTimeout(loopMethod, this.refreshRate);
    };

    // handles keypress event
    Game.prototype.keypress = function (event) {
      if (this.gameStatus == false) {
        switch (event.which) {
          case 78: // n
            this.gameStatus = true;
            this.builder();
            break;
        }
      } else {
        // update keypress trigger
        switch (event.which) {
          case this.triggerKey:
            this.deleteChar();
            break;
        }
      }
    };

    Game.prototype.wordBank = function () {
      var pick = [];
      var bank = ["brain", "brainsssss", "sunflower", "home", "night", "creepy", "snack", "survive", "fitness", "ration", "military", "hero", "survivor", "texas", "backup", "blood", "viral", "weapon", "save", "windows", "fire", "light", "bandaid", "watch", "time", "sun", "solar", "patrol", "checkpoint", "guard", "tower", "freedom", "sanctuary", "garden", "man", "woman", "field", "zoo", "rat", "animal", "pets", "wild", "trap", "scary", "burden", "leader", "faster", "hope", "abandon", "mash", "monster"];
      for (var i = 0; i < this.spawnsPerWave; i++) {
        var rand = bank.splice(Math.floor((Math.random() * bank.length)), 1);
        pick.push(rand[0]);
      }
      return pick;
    };

    // convert a-z to proper keypress event #
    Game.prototype.keycodeMap = function (letter) {
      var code;
      switch (letter) {
        case "a":
          code = 65;
          break;
        case "b":
          code = 66;
          break;
        case "c":
          code = 67;
          break;
        case "d":
          code = 68;
          break;
        case "e":
          code = 69;
          break;
        case "f":
          code = 70;
          break;
        case "g":
          code = 71;
          break;
        case "h":
          code = 72;
          break;
        case "i":
          code = 73;
          break;
        case "j":
          code = 74;
          break;
        case "k":
          code = 75;
          break;
        case "l":
          code = 76;
          break;
        case "m":
          code = 77;
          break;
        case "n":
          code = 78;
          break;
        case "o":
          code = 79;
          break;
        case "p":
          code = 80;
          break;
        case "q":
          code = 81;
          break;
        case "r":
          code = 82;
          break;
        case "s":
          code = 83;
          break;
        case "t":
          code = 84;
          break;
        case "u":
          code = 85;
          break;
        case "v":
          code = 86;
          break;
        case "w":
          code = 87;
          break;
        case "x":
          code = 88;
          break;
        case "y":
          code = 89;
          break;
        case "z":
          code = 90;
          break;
      }

      return code;
    };

    return Game;
  })();

  // initialize game
    $(function () {
      var game;
      game = new Game();
      return $(document).keydown(game.keypress);
    });

}); // end doc ready
