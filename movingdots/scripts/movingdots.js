//setting up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth - 10;
const height = canvas.height = window.innerHeight - 10;

//array of balls, use push/pop to add/remove balls
let balls = [];

//global variables for tuning:
let ballCount = 25;
let ballSize = 10;
let ballFastV = 1.5;
let ballSlowV = 1;
let ballColor = 'green'

//creates ball objects
while (balls.length <= ballCount) {
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + ballSize,width - ballSize),
    random(0 + ballSize,height - ballSize),
    randChoice(ballFastV, ballSlowV),
    random(0, 2*Math.PI),
    ballColor,
    ballSize
  );
  
  balls.push(ball);
}

//loop function
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
  }
  
  requestAnimationFrame(loop);
}

//returns random number between range
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//makes random choice between two numbers
function randChoice(numA, numB) {
	let randomBoolean = Math.random() < 0.5;
	return (randomBoolean ? numA : numB);
}

//ball constructor
//takes velocity, rotation(in radians) and converts to dx, dy
function Ball(x, y, dV, rot, color, size) {
  this.x = x;
  this.y = y;
  this.dx = dV * Math.cos(rot);
  this.dy = dV * Math.sin(rot);
  this.color = color;
  this.size = size;
}

//ball draw function
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

//ball update function
Ball.prototype.update = function() {
  this.x += this.dx;
  this.y += this.dy;
}

//starts animation
loop();