/* SDT Plugin for JSPsych
   Written by Lingxiu Zhang with help from the RDK Plugin for JSPsych.
   Work in progress.
   If you contribute, please add your name to the authors list above.
*/

jsPsych.plugins['sdt'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'sdt',
    parameters: {
    	faster_or_same: {
    		type: jsPsych.plugins.parameterType.INT,
    		pretty_name: "faster?",
    		default: 0,
    		description: "whether there is a faster ball or not"
      },
      trial_duration:
      {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 6000,
        description: 'How long to show trial before it ends.'
      }
    }
  }

  /*------------------------------BEGIN TRIAL------------------------------*/
  plugin.trial = function(display_element, trial){

  /*------------------------convert parameters to SDT------------------------*/
  let faster_check = trial.faster_or_same;

  /*------------------------setting up canvas------------------------*/
  const canvas = document.createElement('canvas');
  display_element.appendChild(canvas); //append canvas to DOM
  const ctx = canvas.getContext('2d'); //get context of canvas so it can be drawn on
  const wh = canvas.width = canvas.height = 250; //set canvas size

  /*------------------------SDT FUNCTIONS BEGIN------------------------*/
  /*-------------------------------------------------------------------*/

  /*------------------------SETUP AND VARIABLES------------------------*/
  let ballCount = 40;
  let ballSize = 4;
  let ballFastV = 0.86;
  let ballSlowV = 0.6;
  let balls = []; //array of balls, use push/pop to add/remove balls
  let ballColor = 'green' //green balls by default
  let circleRadius = wh*0.5 - 2*ballSize //radius is one ball-diameter smaller than half of canvas size

  /*------------------------CREATING BALLS------------------------*/

  //-------------ball constructor-------------
  //spawns ball on circle originating from center of canvas, two ball-widths away from edge of canvas
        //this allows ball position to always be drawn at least one ball width
        //away from the edge of the canvas, to avoid drawing errors
  //takes ball location on circle as vector direction (in radians, 0-2pi), and converts to x, y
  //takes velocity vector with size dV and direction rotV (in radians) as input, and converts to dx, dy
  function Ball(rotP, dV, rotV, color, size) {
    this.x = circleRadius * Math.cos(rotP) + wh*0.5; // adding half of canvas size centers circle
    this.y = circleRadius * Math.sin(rotP) + wh*0.5; // ibid.
    this.dx = dV * Math.cos(rotV);
    this.dy = dV * Math.sin(rotV);
    this.color = color;
    this.size = size;
  }

  //----------------populates balls array with slow balls and one fast ball----------------
  function oneFastBall(){

    while (balls.length < ballCount) {
      //rotP should be between (0, 2pi)
      let rotP = random(0, 2*Math.PI);
      //ball should always move inwards, toward inside of circle
      //this means that ball should move randomly between 45deg arc on either side of radius line
      //which translates to 135deg~225deg (3/4pi ~ 5/4pi). Or for a 60deg arc, (2/3pi ~ 4/3pi)
      //need to add rotP to correct for ball location on circle.
      let rotV = random(2/3*Math.PI, 4/3*Math.PI) + rotP;
      let ball = new Ball(
        rotP,
        ballSlowV, //slow balls
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
      let rotV = random(7/8*Math.PI, 9/8*Math.PI) + rotP;
      let ball = new Ball(
        rotP,
        ballFastV, //one fast ball
        rotV,
        ballColor,
        ballSize
      );
      balls.push(ball); //increments balls.length by 1
    }
  }

  //----------------populates balls array with only slow balls----------------
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

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    };

  /*------------------------FLOW CONTROL------------------------*/
  //loop function
  function animation()
  {
    var start = Date.now()
    function loop(){
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, wh, wh);

      for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
      }

      if (Date.now() - start < 5000) {
      requestAnimationFrame(loop);
      }
      else{
        end_trial()
      }
    }
    loop()

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
  //returns random number (decimal number) between range
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
  if(faster_check) {
  	oneFastBall();
  } else {
	noFastBalls();
  }
  animation();

  //clear display element
  //jsPsych.finishtrial
  /*------------------------------------------------------------*/
  /*------------------------END SDT CODE------------------------*/
  //--------END OF TRIAL--------

  }

  return plugin;

})();
