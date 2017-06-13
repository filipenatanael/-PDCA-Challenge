var game;
var wheel;
var canSpin;
var slices = 4;
var slicePrizes = ["P","D","C","A"];
var prize;
var prizeText;
var randomPosition;
var v_width = window.screen.availWidth;
var v_height = window.screen.availHeight;

function startGame() {
	document.getElementById("loader").style.display = "none";
	Players_Modal();
	// creation of a 458x488 game
	//var screen_adjustment = v_width * 20 / 100;
	game = new Phaser.Game(v_width, v_width, Phaser.AUTO, "gameArea");
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");
}

window.onload = function() {
	var myVar;
	myVar = setTimeout(startGame, 5000);
}

//PLAYGAME
var playGame = function(game){};
playGame.prototype = {
	preload: function(){
		game.load.image("wheel", "wheel.png");
		game.load.image("pin", "pin.png");
	},
	//funtion to be executed when the state is created
	create: function(){
		game.stage.backgroundColor = "#0000";
		wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
		wheel.anchor.set(0.5);

		wheel.width = 300;
		wheel.height = 300;

		var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
		pin.anchor.set(0.5);
		prizeText = game.add.text(game.world.centerX, 480, "");
		prizeText.anchor.set(0.5);
		prizeText.align = "center";
		canSpin = true;
		game.input.onDown.add(this.spin, this);
	},
	spin(){
		if(canSpin){
			prizeText.text = "";
			var rounds = game.rnd.between(1, 2);
			var degrees = game.rnd.between(0, 360);
			prize = slices - 1 - Math.floor(degrees / (360 / slices));
			canSpin = false;
			var spinTween = game.add.tween(wheel).to({
				angle: 360 * rounds + degrees
			}, 3000, Phaser.Easing.Quadratic.Out, true);
			spinTween.onComplete.add(this.winPrize, this);
		}
	},
	// function to assign the prize
	winPrize(){
		canSpin = true;
		//alert(window.screen.availWidth+"x"+window.screen.availHeight);
		//alert(window.screen.availHeight);
		randomPosition = getRandomInt();
		document.getElementById('conteudo').innerHTML = questions_array[randomPosition]['question'];
		Enable_Button();
		setTimeout(function(){$("#myModal").modal();}, 3000);


	}
}
