/*------------------------SETUP AND VARIABLES------------------------*/
//setting up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const wh = canvas.width = canvas.height = 250;

//array of balls, use push/pop to add/remove balls
let balls = [];

//global ball variables:
let ballCount = 25;
let ballSize = 5;
let ballFastV = 0.8;
let ballSlowV = 0.3;
let ballColor = 'green'
let circleRadius = wh*0.5 - 2*ballSize //radius is two ball-widths smaller than half of canvas size

/*------------------------CREATING BALLS------------------------*/
//-----ball constructor-----
//spawns ball on circle originating from center of canvas, two ball-widths away from edge of canvas
      //this allows ball position to always be drawn at least one ball width
      //away from the edge of the canvas, to avoid drawing errors
//takes ball location on circle as vector direction (in radians, 0-2pi), and converts to x, y
//takes velocity vector with size dV and direction rotV (in radians!) as input, and converts to dx, dy
function Ball(rotP, dV, rotV, color, size) {
  this.x = circleRadius * Math.cos(rotP) + wh*0.5; // adding half of canvas size centers circle
  this.y = circleRadius * Math.sin(rotP) + wh*0.5; // ibid.
  this.dx = dV * Math.cos(rotV);
  this.dy = dV * Math.sin(rotV);
  this.color = color;
  this.size = size;
}

//populates balls array with slow balls and one fast ball
function oneFastBall(){
  while (balls.length < ballCount) {
    //store rotP variable to help inform ball direction
    let rotP = random(0, 2*Math.PI);
    //ball should always move inwards, toward inside of circle
    //this means that ball should move randomly between 45deg arc on either side of radius line
    //which translates to 135deg~225deg. need to add rotP to correct for ball location on circle.
    let rotV = random(3/4*Math.PI, 5/4*Math.PI) + rotP;
    
    let ball = new Ball(
      rotP,
      ballSlowV,
      rotV,
      ballColor,
      ballSize
    );
    balls.push(ball);
  }

  while (balls.length <= ballCount) {
    //ibid. (check above)
    let rotP = random(0, 2*Math.PI);
    //ibid. (check above)
    let rotV = random(3/4*Math.PI, 5/4*Math.PI) + rotP;
    
    let ball = new Ball(
      rotP,
      ballFastV,
      rotV,
      ballColor,
      ballSize
    ); 
    balls.push(ball);
  }
}

//populates balls array with only slow balls
function noFastBalls(){
  while (balls.length <= ballCount) {
    //store rotP variable to help inform ball direction
    let rotP = random(0, 2*Math.PI);
    //ball should always move inwards, toward inside of circle
    //this means that ball should move randomly between 45deg arc on either side of radius line
    //which translates to 135deg~225deg. need to add rotP to correct for ball location on circle.
    let rotV = random(3/4*Math.PI, 5/4*Math.PI) + rotP;
    
    let ball = new Ball(
      rotP,
      ballSlowV,
      rotV,
      ballColor,
      ballSize
    );
    balls.push(ball);
  }
}

/*------------------------FLOW CONTROL------------------------*/
//loop function
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, wh, wh);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
  }
  
  requestAnimationFrame(loop);
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

/*------------------------UTILITY FUNCTIONS------------------------*/
//returns random number (not integer) between range
function random(min, max) {
  const num = Math.random() * (max - min) + min;
  return num;
}

//makes random choice between two numbers
function randChoice(numA, numB) {
	let randomBoolean = Math.random() < 0.5;
	return (randomBoolean ? numA : numB);
}

/*------------------------RUNNING THE SCRIPT------------------------*/
//starts animation
oneFastBall();
//noFastBalls();
loop();