canvas   = 0;
context  = 0;
height   = 0;
width    = 0;
frames   = 0;
maxJumps = 3;
pause = false;

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
	height: 50,
	width: 50,
	color: '#ff4e4e',
	gravity: 1.6,
	velocity: 0,
	jumpForce: 20,
	jumpCount: 0,

	update: function() {

		this.velocity += this.gravity;
		this.y += this.velocity;

		if (this.y > (ground.y - this.height)) {
			this.y = ground.y - this.height;
			this.jumpCount = 0;
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

			if ( (obs.x + obs.width) < 0) {
				var obj = this.obstacles.splice(i, 1);
				console.log(obj[0]);
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

	block.jump();
}

function run() {

	if (!pause) {
		update();
		draw();
	}

	window.requestAnimationFrame(run);
}

function draw() {
	context.fillStyle = '#50beff';
	context.fillRect(0,0, width, height);

	ground.draw();
	obstacle.draw();
	block.draw();
}

function update() {
	obstacle.update();
	block.update();
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

	run();
}

// start game
main();