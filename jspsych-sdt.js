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
    	choices: {
    		type: jsPsych.plugins.parameterType.INT,
    		pretty_name: "Choices",
    		default: [],
    		array: true,
    		description: "The valid keys that the subject can press to indicate a response"
    	},
    	correct_choice: {
		    type: jsPsych.plugins.parameterType.STRING,
		    pretty_name: "Correct choice",
		    default: undefined,
		    array: true,
		    description: "The correct key for that trial"
		},
		trial_duration: {
		    type: jsPsych.plugins.parameterType.INT,
		    pretty_name: "Trial duration",
		    default: 3000,
		    description: "The length of stimulus presentation"
		},
		number_of_dots: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: "Number of dots",
			default: 50,
			description: "The number of dots per stimulus"
		},
		dot_radius: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: "Dot radius",
			default: 4,
			description: "The radius of the dots in pixels"
		},
		dot_fast_velocity: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: "Fast dot velocity",
			default: 1.0,
			description: "The velocity of the fast dot"
		},
		dot_slow_velocity: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: "Slow dot velocity",
			default: 0.3,
			description: "The velocity of the slow dots"
		},
		canvas_size: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: "Canvas Size",
			default: 250,
			description: "The edge length of the square canvas"
		},
    }
  }

/*------------------------------BEGIN TRIAL------------------------------*/
  plugin.trial = function(display_element, trial){
  
  /*------------------------set parameters------------------------*/
  trial.choices = assignParameterValue(trial.choices, []);
  trial.correct_choice = assignParameterValue(trial.correct_choice, undefined);
  trial.trial_duration = assignParameterValue(trial.trial_duration, 3000);
  trial.number_of_dots = assignParameterValue(trial.number_of_dots, 50);
  trial.dot_radius = assignParameterValue(trial.dot_radius, 4);
  trial.dot_fast_velocity = assignParameterValue(trial.dot_fast_velocity, 1.0);
  trial.dot_slow_velocity = assignParameterValue(trial.dot_slow_velocity, 0.3);
  trial.canvas_size = assignParameterValue(trial.canvas_size, 250);
  
  /*------------------------convert parameters to SDT------------------------*/
  let ballCount = trial.number_of_dots;
  let ballSize = trial.dot_radius;
  let ballFastV = trial.dot_fast_velocity;
  let ballSlowV = trial.dot_slow_velocity;
  let canvas_size = trial.canvas_size;
  
  //set up object to store response data (with rt and key)
  var response = {
	rt: -1,
	key: -1
  }
  
  /*------------------------setting up canvas------------------------*/
  const canvas = document.createElement('canvas');
  display_element.appendChild(canvas); //append canvas to DOM
  const ctx = canvas.getContext('2d'); //get context of canvas so it can be drawn on
  const wh = canvas.width = canvas.height = canvas_size; //set canvas size
  
  
  /*--------------------JSPSYCH FUNCTIONS BEGIN--------------------*/
  /*---------------------------------------------------------------*/	
  	
  //------------start the keyboard listener------------
  function startKeyboardListener(){
  	//start if there are choices for keys
  	if (trial.choices != jsPsych.NO_KEYS) {
  		//listen for subjects' key response
  		keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
  			callback_function: after_response, //call this after a valid key was pressed
  			valid_responses: trial.choices, //keys that will be considered a valid response
  			rt_method: 'performance', //The type of method to record timing information
  			//If set to false, keyboard listener will only trigger the first time a valid key is pressed.
  			//If set to true, it has to be explicitly cancelled by the cancelKeyboardResponse plugin API.
  			persist: false,
  			//Only register the key once, after this getKeyboardResponse function is called.
  			//(Check JsPsych docs for better info under 'jsPsych.pluginAPI.getKeyboardResponse').
  			allow_held_key: false
  		});
  	}
  }
  
  //Function to record the first response by the subject
  function after_response(info) {
  	//If the response has not been recorded, record it
  	if (response.key == -1) {
  		response = info; //Replace the response object created above
  	}
  	//end the trial
  	end_trial();
  }
  
  //-------------------end the trial-------------------
  function end_trial() {
	//end the keyboard listener
	if (typeof keyboardListener !== 'undefined') {
		jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
	}
	//store trial data
	var trial_data = {
		"rt": response.rt,
		"key_pressed": response.key
		"correct?": check_correct(),
		"key_choices": trial.choices,
		"trial_duration": trial.trial_duration,
		"number_of_dots": trial.number_of_dots,
		"dot_radius": trial.dot_radius,
		"dot_fast_velocity": trial.dot_fast_velocity,
		"dot_slow_velocity": trial.dot_slow_velocity,
		"canvas_size": trial.canvas_size,
	}
	jsPsych.finishTrial(trial_data); //formally end the trial
  }
  
  //-----------check if response is correct------------
  function check_correct(){			
	//Check that the correct_choice has been defined
	if(typeof trial.correct_choice !== 'undefined'){
		if(trial.correct_choice.constructor === Array){ //check if it is an array
			//If the elements are characters
			if(typeof trial.correct_choice[0] === 'string' || trial.correct_choice[0] instanceof String){
				//Convert all the values to upper case
				trial.correct_choice = trial.correct_choice.map(function(x){return x.toUpperCase();});
				//If the response is included in the correct_choice array, return true. Else, return false.
				return trial.correct_choice.includes(String.fromCharCode(response.key));
			}
			//Else if the elements are numbers (javascript character codes)
			else if (typeof trial.correct_choice[0] === 'number'){
			    //If the response is included in the correct_choice array, return true. Else, return false.
				return trial.correct_choice.includes(response.key);
			}
		}
		//Else compare the char with the response key
		else{
			//If the element is a character
			if(typeof trial.correct_choice === 'string' || trial.correct_choice instanceof String){
				//Return true if the user's response matches the correct answer. Return false otherwise.
				return response.key == trial.correct_choice.toUpperCase().charCodeAt(0);
			}
			//Else if the element is a number (javascript character codes)
			else if (typeof trial.correct_choice === 'number'){
				console.log(response.key == trial.correct_choice);
				return response.key == trial.correct_choice;
			}
		}
	}
  }
  
  /*------------------------SDT FUNCTIONS BEGIN------------------------*/
  /*-------------------------------------------------------------------*/
  
  /*------------------------SETUP AND VARIABLES------------------------*/
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
      //which translates to 135deg~225deg (3/4pi ~ 5/4pi).
      //need to add rotP to correct for ball location on circle.
      let rotV = random(3/4*Math.PI, 5/4*Math.PI) + rotP;
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
      let rotV = random(3/4*Math.PI, 5/4*Math.PI) + rotP;
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
  
  /*------------------------------------------------------------*/
  /*------------------------END SDT CODE------------------------*/
  
  } //--------END OF TRIAL--------

  return plugin;

})();