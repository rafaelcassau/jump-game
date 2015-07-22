canvas   = 0;
context  = 0;
height   = 0;
width    = 0;
frames   = 0;
maxJumps = 3;
pause = false;
currentState = 0;
best_score = 0;
image = null;

states = {
	PLAY: 0,
	PLAYING: 1,
	LOSE: 2
},

ground = {
	y: 550,
	height: 50,
	color: '#ffdf70',

	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(0, this.y, width, this.height);
	}
};

var block = {
	x: 50,
	y: 0,
	// height: spriteDoll.height;
	// width: spriteDoll.width;
	height: 50,
	width: 50,
	color: '#ff4e4e',
	gravity: 1,
	velocity: 0,
	jumpForce: 20,
	jumpCount: 0,
	score: 0,

	update: function() {

		this.velocity += this.gravity;
		this.y += this.velocity;

		if (this.y > (ground.y - this.height) && currentState != states.LOSE) {
			this.y = ground.y - this.height;
			this.jumpCount = 0;
			this.velocity = 0;
		}
	},

	jump: function() {
		if (this.jumpCount < maxJumps) {
			this.velocity = -this.jumpForce;
			this.jumpCount++;
		}
	},

	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		// spriteDoll.draw(this.x, this.y);
	}
};

obstacle = {

	obstacles: [],
	colors: ['#ffbc1c', '#ff1c1c', '#ff85e1', '#52a7ff', '#78ff5d'],
	velocity: 4,
	addTime: 0,

	add: function() {
		var obstacle = this.createObstacle();
		this.addTime = 40 + Math.floor(20 * Math.random());

		this.obstacles.push(obstacle);
	},

	createObstacle: function() {
		var obstacle = {
			x: width,
			width: 30 + Math.floor(20 * Math.random()),
			height: 30 + Math.floor(120 * Math.random()),
			color: this.colors[Math.floor(5 * Math.random())],
		};
		return obstacle;
	},

	update: function() {

		if (this.addTime == 0) {
			this.add();
		} else {
			this.addTime--;
		}

		for (var i = 0; i < this.obstacles.length; i++) {
			var obs = this.obstacles[i];
			obs.x = obs.x - this.velocity;

			if ( block.x < (obs.x + obs.width) && 
				 (block.x + block.width) >= obs.x && 
				 (block.y + block.height) >= (ground.y - obs.height)) {

				currentState = states.LOSE;
			
			} else if (block.x > (obs.x + obs.width) && (obs.x + obs.width) < 0) {
				block.score++;
			}
			
			if ( (obs.x + obs.width) < 0) {
				var obj = this.obstacles.splice(i, 1);
			}
		}
	},
	
	draw: function() {

		for (var i = 0; i < this.obstacles.length; i++) {
			var obs = this.obstacles[i];
			context.fillStyle = obs.color;
			context.fillRect(obs.x, ground.y - obs.height, obs.width, obs.height);
		}
	}
};

function click(event) {

	if (currentState == states.PLAYING) {
		block.jump();
	} else if (currentState == states.PLAY) {
		currentState = states.PLAYING;
	} else if (currentState == states.LOSE) {
		
		if (block.score > best_score) {
			best_score = block.score;
			localStorage.setItem('best_score', best_score);
		}

		block.y = 0;
		obstacle.obstacles = [];
		block.score = 0;
		currentState = states.PLAY;
	}
}

function run() {

	if (!pause) {
		update();
		draw();
	}

	window.requestAnimationFrame(run);
}

function draw() {

	// background.draw(0, 0);
	// spriteDoll.draw(50, 50);

	context.fillStyle = '#50beff';
	context.fillRect(0,0, width, height);

	context.fillStyle = '#fff';
	context.font = '50px Arial';
	context.fillText(block.score, 10, 40);

	if (currentState == states.PLAY) {

		context.fillStyle = 'green';
		context.fillRect(width / 2 -50, height / 2 -50, 100, 100);
	
	} else if (currentState == states.LOSE) {

		context.fillStyle = 'red';
		context.fillRect(width / 2 -50, height / 2 -50, 100, 100);

		context.save();
		context.translate(width / 2, height / 2);
		context.fillStyle = '#fff';
		
		if (block.score > best_score) {
			context.fillText('Novo Record!', -150, -65);
		} else if (best_score < 10) {
			context.fillText('Record ' + best_score, -99, -65);
		} else if (best_score >= 10 && best_score < 100) {
			context.fillText('Record ' + best_score, -112, -65);
		} else {
			context.fillText('Record ' + best_score, -125, -65);
		}

		if (block.score < 10) {
			context.fillText(block.score, -13, 19);
		} else if (block.score >= 10 && block.score < 100) {
			context.fillText(block.score, -26, 19);
		} else {
			context.fillText(block.score, -39, 19);
		}

		context.restore();

	} else if (currentState == states.PLAYING) {

		obstacle.draw();
	}

	ground.draw();
	block.draw();
}

function update() {

	block.update();

	if (currentState == states.PLAYING) {
		obstacle.update();
	}

	frames++;
}

function pauseGame(event) {
	if (event.keyCode == 32) {
		pause = !pause;
	}
}

function main() {
	height = window.innerHeight;
	width = window.innerWidth;

	if (width >= 500) {
		width = 600;
		height = 600;
	}

	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.style.border = '1px solid #000';

	context = canvas.getContext('2d');
	document.body.appendChild(canvas);

	document.addEventListener('mousedown', click);
	document.addEventListener('keyup', pauseGame);

	currentState = states.PLAY;

	best_score = localStorage.getItem('best_score');
	if (best_score == null) {
		best_score = 0;
	}

	image = new Image();
	// image.src = '../images/sheet.png';

	run();
}

// start game
main();