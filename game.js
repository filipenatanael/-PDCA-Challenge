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

var plays = 0;
var player1 = {
	'nickname': '',
	'points': '0'
};
var player2 = {
	'nickname': '',
	'points': '0'
};

var max_points = 100;
var max_questions;
//------------------------------------------------------------------------
//---- Function Players Modal ----
function Players_Modal(){
	$("#PlayersModal").modal({backdrop: "static"});
}

function setPlayers(){
	//document.getElementById("input_player1");
	player1['nickname'] = document.getElementById("input_player1").value;
	document.getElementById("span_player1").innerHTML = player1['nickname'];
	player2['nickname'] = document.getElementById("input_player2").value;
	document.getElementById("span_player2").innerHTML = player2['nickname'];

	max_questions = document.getElementById("select_rounds").value;

	if(player1['nickname'] != 0 || player2['nickname'] != 0){
		$('#PlayersModal').modal('hide');

	}
}

//------------------------------------------------------------------------

function getRandomInt() {
	do{
		var position =  Math.floor(Math.random() * (48 - 1)) + 1;
	}while(questions_array[position]['status'] == 1);
	return position;
}

function responder(event){
	Disable_Button();
	switch(event) {
		case 1:
		if(slicePrizes[prize] == questions_array[randomPosition]['answer']){
			document.getElementById("hit_answer").style.display = 'block';
			questions_array[randomPosition]['status'] = '1';
			AssignPoints();
		}else{
			document.getElementById("missed_answer").style.display = 'block';
		}
		break;
		case 2:
		if(slicePrizes[prize] == questions_array[randomPosition]['answer']){
			document.getElementById("missed_answer").style.display = 'block';
		}else{
			document.getElementById("hit_answer").style.display = 'block';
			questions_array[randomPosition]['status'] = '1';
			AssignPoints();
		}
		break;
	}
	//Proximo jogador
	plays = plays + 1;
}

//------------------------------------------------------------------------
function getPlayer(){
	if(plays%2==0){
		return player1;
	}else{
		return player2;
	}
}
//------------------------------------------------------------------------

//Atrubuir pontos ao jogadores
function AssignPoints(){
	var turn = plays%2;
	switch(turn) {
		case 0:
		//Case to player 1
		//player1['points'] = parseInt(player1['points']) + 10;
		player1['points'] = parseInt(player1['points']) + (max_points/max_questions);
		if(player1['points'] == max_points){
			document.getElementById("span_progress_p1").innerHTML =  player1['points'] + "%";
			document.getElementById("progress_p1").style.width = player1['points'] + "%";
			ResetGame(player1);
		}else{
			document.getElementById("span_progress_p1").innerHTML =  player1['points'] + "%";
			document.getElementById("progress_p1").style.width = player1['points'] + "%";
		}
		break;
		case 1:
		//Case to player 2
		player2['points'] = parseInt(player2['points']) + (max_points/max_questions);
		if(player2['points'] == max_points){
			document.getElementById("span_progress_p2").innerHTML =  player2['points'] + "%";
			document.getElementById("progress_p2").style.width = player2['points'] + "%";
			ResetGame(player2);
		}else{
			document.getElementById("span_progress_p2").innerHTML =  player2['points'] + "%";
			document.getElementById("progress_p2").style.width = player2['points'] + "%";
		}

		break;
	}

}
//------------------------------------------------------------------------

//Atrubuit ganhador e resetar game
function ResetGame(player){
	$('#myModal').modal('hide');
	document.getElementById("Winner").innerHTML =  player['nickname'];
	$("#WinGameModal").modal({backdrop: "static"});

	plays = 0;
	player1['nickname'] = '';
	player1['points'] = '';
	player2['nickname'] = '';
	player2['points'] = '';
}


function Disable_Button(){
	document.getElementById('btn_yes').disabled=true;
	document.getElementById('btn_no').disabled=true;
}

function Enable_Button(){
	document.getElementById('btn_yes').disabled=false;
	document.getElementById('btn_no').disabled=false;
}

function buttomToHide(){
	document.getElementById("hit_answer").style.display = 'none';
	document.getElementById("missed_answer").style.display = 'none';
}

//-------------------------------------------------------------------------
//--------------------------------------------------------------------------

function newGame() {
	document.getElementById("players_progress").style.display = "block";
	document.getElementById("pdca_logo").style.display = "block";
	document.getElementById("loader").style.display = "none";
	Players_Modal();
	// creation of a 458x488 game
	game = new Phaser.Game(v_width, v_width, Phaser.AUTO, "gameArea");
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");
}

window.onload = function() {
	var myVar;
	myVar = setTimeout(newGame, 1000);
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
		randomPosition = getRandomInt();
		var isPlayinig = getPlayer();
		switch(slicePrizes[prize]) {
			case 'P':
			document.getElementById("where_stopped").innerHTML = "[ "+isPlayinig['nickname']+" ] Plan";
			break;
			case 'D':
			document.getElementById("where_stopped").innerHTML = "[ "+isPlayinig['nickname']+" ] Do";
			break;
			case 'C':
			document.getElementById("where_stopped").innerHTML = "[ "+isPlayinig['nickname']+" ] Check";
			break;
			case 'A':
			document.getElementById("where_stopped").innerHTML = "[ "+isPlayinig['nickname']+" ] Action";
			break;
		}

		document.getElementById('conteudo').innerHTML = questions_array[randomPosition]['question'];
		Enable_Button();
		setTimeout(function(){$("#myModal").modal();}, 1000);

	}


}
