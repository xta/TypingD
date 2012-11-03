$(document).ready(function() { // 2012 TypingD.js by rexfeng
    /* Index of Components
        -(set up)
        -Game  
          (define)
          start
          builder
          buildLoadingMsg
          detectFirst
          detectEmpty
          deleteChar
          skipNext
          loopNext
          update
          keyPress
          wordBank
          keycodeMap
        -(initialize Game)
    */

  var Game;
  var _bind = function(fn, a){ return function(){ return fn.apply(a, arguments); }; };

  Game = (function() {
    function Game() {
      this.keypress = _bind(this.keypress, this);
      this.update = _bind(this.update, this);
      this.start();
    }


    Game.prototype.start = function() {

      this.refreshRate = 1000 / 60; // in milliseconds

      this.mapSize = 75; // length of map
      this.buffer = 10; // set # of spaces between spawns

this.spawnsPerWave = 1; // set # of words per wave
      this.totalWaves = 3;
      this.maxSpawns = this.totalWaves * this.spawnsPerWave;

      this.currentWave = 1;
      this.spawnsToDate = 0;

      this.delayCounter = 0; // current delay counter
      this.delayMax = 11;

      this.gameStatus = false; // if false, show loadingMessage, else, play game
      this.gameOver = false;
      this.buildLoadingMsg("Press (n) key to start.");

      return this.update();
    };


    Game.prototype.builder = function() { // builder builds the url hash array at start of each wave

      this.url = [];
      var words = this.wordBank();

      // build background before words start
      for (var i = 0; i < (this.mapSize-1); i++) {
        this.url.push("-");
      }

      for (var j = 0; j < words.length; j++) {

        // build the word, letter by letter
        for (var _j = 0; _j < words[j].length; _j++) {
          this.url.push(words[j].charAt(_j));
        }

        // append the buffer background separator
        if (j !== (words.length) ) {
          for (var _k = 0; _k < this.buffer; _k++) {
            this.url.push("-");
          }
        }

      }

      return this.url;
    };


    Game.prototype.buildLoadingMsg = function(phrase) {

      this.url = [];
      var xtimes = 0;
      if ((this.mapSize - 10) > phrase.length ) {
        xtimes += (this.mapSize - phrase.length);
      } else {
        xtimes += 10;
      }

      // add "-" xtimes before phrase
      for (var x = 0; x < xtimes; x++) {
        this.url.push('-');
      }

      // add phrase
      for (var y = 0; y < phrase.length; y++) {
        this.url.push(phrase.charAt(y));
      }

      return this.url;
    };


    Game.prototype.detectFirst = function() {
      // get the first letter position in array (non "-")
      var firstPosition = 999; // set dummy
      for (var x = 0; x < this.url.length; x++) {
        if (this.url[x] !== "-") {
          firstPosition = x;
          break;
        }
      }
      return firstPosition;
    };


    Game.prototype.detectEmpty = function() {
      // check if the whole url array is empty AKA only ("-")

      var isEmpty = true;
      for (var x = 0; x < this.url.length; x++) {
        if (this.url[x] !== "-") {
          isEmpty = false;
          break;
        }
      }
      return isEmpty;
    };


    Game.prototype.deleteChar = function() {
      
      var first = this.detectFirst();
      if (first !== 999) {
        this.url[first] = "-";
      }
    };


    Game.prototype.skipNext = function(cut) {
      // if this.mapSize is all "-", then iterate array First Position - MapSize
      for (var x = 0; x < cut; x++)
        var move = this.url.shift();
        this.url.push(move);
    };


    Game.prototype.loopNext = function() {
      // iterate the loop 1 cycle
      
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


    Game.prototype.update = function() {
    // check status of url, then adjust accordingly
    
// console.log("this.gameStatus: " + this.gameStatus);
console.log("currentwave: " + this.currentwave);
// console.log("total waves: " + this.totalWaves);
// console.log("this.gameover: " + this.gameOver);

    if (this.gameStatus == true) {

      if (this.detectEmpty() == true) {

        if (this.currentWave == (this.totalWaves + 1)) {
        
          // gameover. Victory loadingMsg, option to restart
            this.gameStatus = false;
            this.gameOver = true;
            this.buildLoadingMsg("The end! You won. :D Press (n) to play again.");
            //document.title = "Typing of the DOM | by rfeng";

        } else {

          // else, build next wave
            this.currentWave += 1;
            this.delayMax -= 4;
//this.spawnsPerWave += 5;
            this.builder();
            //document.title = "Wave " + this.currentWave + "\/" + this.totalWaves + " | Typing of the DOM";
        }

      } else {

        if (this.detectFirst() == 0) {
          // if first == positon 0, then game over loadingMsg, option to restart
          if (this.gameOver == false) {
            this.gameStatus = false;
            this.gameOver = true;
            this.buildLoadingMsg("Game over! :( Press (n) to restart.");
          }

        } else if (this.detectFirst() > this.mapSize) {
          // skipNext to trim array
            var cut = this.detectFirst() - this.mapSize;
            this.skipNext(cut);
            this.triggerKey = this.keycodeMap(this.url[this.detectFirst()]);
        } else {
          // else setup next key to trigger deletion switch
            this.triggerKey = this.keycodeMap(this.url[this.detectFirst()]);

        } // end detectFirst
          
      } // end detectEmpty

    } else {
    // if gameStatus == false

    }
    
    this.loopNext();
    location.hash = this.url.slice(0,this.mapSize).join("");

    // infinite loop controls
      var timeDelay;
      var that = this;
      var loopMethod = function() { that.update(); }
      timeDelay = window.setTimeout(loopMethod, this.refreshRate);
    };


    Game.prototype.keypress = function(event) {

      if (this.gameStatus == false) {
        switch (event.which) {
          case 78: // n
            this.gameStatus = true;
            this.gameOver = false;
            this.builder();
            //document.title = "Wave " + this.currentWave + "\/" + this.totalWaves + " | Typing of the DOM";
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
    }; // end Game.prototype.keypress


    Game.prototype.wordBank = function() {

      var pick = [];
      var bank = [
                    "brain",
                    "brainsssss",
                    "sunflower",
                    "home",
                    "night",
                    "creepy",
                    "snack",
                    "survive",
                    "fitness",
                    "ration",
                    "military",
                    "hero",
                    "survivor",
                    "texas",
                    "backup",
                    "blood",
                    "viral",
                    "weapon",
                    "save",
                    "windows",
                    "fire",
                    "light",
                    "bandaid",
                    "watch",
                    "time",
                    "sun",
                    "solar",
                    "patrol",
                    "checkpoint",
                    "guard",
                    "tower",
                    "freedom",
                    "sanctuary",
                    "garden",
                    "man",
                    "woman",
                    "field",
                    "zoo",
                    "rat",
                    "animal",
                    "pets",
                    "wild",
                    "trap",
                    "scary",
                    "burden",
                    "leader",
                    "faster",
                    "hope",
                    "abandon",
                    "mash",
                    "monster"
                 ];
      for (var i = 0; i < this.spawnsPerWave; i++) {
        var rand = bank.splice( Math.floor( (Math.random() * bank.length) ),1);
        pick.push(rand[0]);
      }
    return pick;
    };


    Game.prototype.keycodeMap = function(letter) {

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
    $(function() {
      var game;
      game = new Game();
      return $(document).keydown(game.keypress);
    });






}); // end doc ready