// Signal Detection method object
// this method will run an experiment using the psychophysical signal detection method
// it calculates hits misses, false alarms and correct rejection and shares the results.
function SignalDetection(idParam, idResp){
//	alert("Signal Detection Method");
	this.getParameters = false;	// flag if want to get the parameters from the page
	this.idParam = idParam;		// the canvas for the getting of the parameters
	this.idResp  = idResp;
	this.canvasResp = null;		// the canvas upon which the response buttons and text will be drawn.

	// the two responses buttons needed
	this.yesButton = null;
	this.noButton = null;
	this.stimName = "d'";			// the name of the stimulus gotten via the experiment object from the stimulus object

	// what type of method is this
	this.typeMethod = SIG_DET;
	this.thresholdVal = 0.50;  //not uses in this method

	// parameters to be gotten from the experiment object to control this experiment
	this.expParam = [];			//  not sure what i need here yet
	this.QUEST = 0;				// the second item in the array is the question to ask the participant.
//	this.MOD_LEVEL = 2;			// the stimulus level for the modulus stimulus

	// name of iv of experiment
	this.ivName = "";

	// data objects.  Need to be constructed to be generic or informative
	this.trialVals = [];		// the data array for the trial by trial data.  It will have two dimensions
	this.data = [];				// the data array for the psychometric function.  It will have two dimensions
								// dimension 1 is the level of the Iv and is referred to as rows
								// dimension 2 is percentage of time that level of the IV is detected and is referred to as columns
	this.NUM_COL = 2; // the number of columns in the data array
	this.COL0 = "Yes";
	this.COL1 = "No"; // name of what is stored in Column 0
	this.question = "Was the Signal Present"; // question to ask the participant
	this.dataLabels = [this.COL0,this.COL1];
	this.xLabel = "The IV Level";
	this.yLabel = this.COL1;
	this.trialData = [];		// a variable to hold the data for a given trial
	this.lastTrial = false;		// flag to indicate if the last trial has been executed
	this.levelsShown = [];		// array to track the number of times each level has been presented

	// values to track the movement of the trials through the experiment.
	this.trial = 0;     // the current trial and the index of data array.
	this.sigTrial = 0;	// the number of trials in the experiment where the signal is shown.

	// sliders to get values for experiment
	this.sldrNumberTrials = null;  // number of trials in the experiment
	this.sldrPercentage = null; // number of staircases
	this.trialsLabel = "Number of Trials";
	this.percentageLabel = "Percentage of Trials With a Signal";
	// sliders to control the IV
//	this.sldrIVMin;  // the lowest value possible
//	this.sldrIVMax;  // the maximum value possible.
	this.ivLevels = [];	// the array that holds all of the levels of the IV.

	// values related to the independent variable series.
//	this.numIvLvlDflt = 1;
	this.numTrialsDflt = 40;  // default number of trials
	this.percentDflt = 50;
	this.numTrials = this.numTrialsDflt;  // the total number of trials in the experiment
	this.percentSig = this.percentDflt;
	this.numTrialsSig = Math.floor(this.numTrials*this.percentSig/100+0.5);  // number of trials in the
	// experiment with the signal, rounded (the 0.5).
//	this.ivMin;				// minimum value of the IV
//	this.ivMax;				// maximum Value of the IV
//	this.ivMinDflt;
//	this.ivMaxDflt;			// default levels for minimum and maximum
	var LINEAR = 0;		// linear scale
	var LOG    = 1;		// logarithmic scale
	this.ivLevelType = LINEAR;		// default use a linear scale
	this.def = new Defaults();		// object with default settings for the site.

	this.donePos = [];		// parameters of the done button
	this.respPos = [];		// the screen position and parameters of the response box
	this.response = "";		// the current response value
	this.color1Norm = colorString(125,125,125);
	this.color2Norm = colorString(175,175,175);
	this.color1Over = colorString(75,75,75);
	this.color2Over = colorString(125,125,125);
	this.doneLabel = "Done";
	this.doneButtonStat  = true;  // true means mouse is over button
	this.showResp = false;  // flag to indicate if response objects are visible.  false means no
	// use the modulus response objects
	this.modulusRad = null;
	this.modText = null;
	this.useModulus = false;
	this.modulus = 50;
	this.showModulus = false;
	this.modValue = 1;  // the stimulus level for the modulus

	// response objects
	this.yesPos = [];  // parameters of the yes button
	this.noPos = [];   // parameters of the no button
	var YES = 0;  // values for the two possible responses
	var NO = 1;   // values for the two possible responses
	this.color1Norm = colorString(125,125,125);
	this.color2Norm = colorString(175,175,175);
	this.color1Over = colorString(75,75,75);
	this.color2Over = colorString(125,125,125);
	this.yesButtonStat = true;  // true means mouse is over button
	this.noButtonStat  = true;  // true means mouse is over button
	this.showResp = false;  // flag to indicate if response objects are visible.  false means no

	var self = this;  // bind the values to the object.

	// set up the parameters page if needed
	this.setupParameters = function(ivName){
		this.ivName = ivName;
		this.COL0 = this.ivName;  // set the name of the first column of the data variable.
		this.yLabel = this.COL1;
		this.xLabel = this.ivName;
		this.dataLabels = [this.COL0,this.COL1];
		this.getParameters = true;
//		alert("setting up parameters");
		var paramArea = document.getElementById(this.idParam);  // the paragraph that will hold the parameters
		var innerHTML = "<canvas id='trials'> </canvas><br><canvas id='percentage'> </canvas><br>";
		innerHTML += "Trials are presented in a random order.";
		paramArea.innerHTML = innerHTML;

		// set up the sliders to control how the MOCS will run
		this.sldrNumberTrials = new Slider(this.trialsLabel,trials,75);
		this.sldrNumberTrials.setSliderStep(1);
		this.sldrNumberTrials.setRange(20,200);
		this.sldrNumberTrials.setShowMaxMin(true);
		this.sldrNumberTrials.setValue(this.numTrialsDflt);
		this.sldrPercentage = new Slider(this.percentageLabel,percentage,75);
		this.sldrPercentage.setSliderStep(1);
		this.sldrPercentage.setRange(0,100);
		this.sldrPercentage.setShowMaxMin(true);
		this.sldrPercentage.setValue(this.percentDflt);
	};

	// set of the control objects to get the values to determine the limits of the IV.
	this.setupIVControl = function(ivControlID, exParam){
		var controlArea = document.getElementById(ivControlID);
		controlArea.innerHTML = "There are no special settings for this experiment";
//		var innerHTML = exParam.ivInstructions;
//		innerHTML += "<canvas id='ivMin'> </canvas><br><canvas id='ivMax'> </canvas><br>";
//		controlArea.innerHTML = innerHTML;
//		this.sldrIVMin = new Slider("Minimum Value of "+this.ivName,ivMin,75);
//		this.sldrIVMin.setSliderStep(exParam.ivMinStep);
//		this.sldrIVMin.setRange(exParam.ivLoMin,exParam.ivLoMax);
//		this.sldrIVMin.setShowMaxMin(true);
//		this.sldrIVMin.setValue(exParam.ivLoDef);
//		this.ivMinDflt = exParam.ivLoDef;
//		this.sldrIVMax = new Slider("Minimum Value of "+this.ivName,ivMax,75);
//		this.sldrIVMax.setSliderStep(exParam.ivMaxStep);
//		this.sldrIVMax.setRange(exParam.ivHighMin,exParam.ivHighMax);
//		this.sldrIVMax.setShowMaxMin(true);
//		this.sldrIVMax.setValue(exParam.ivHighDef);
//		this.ivMaxDflt = exParam.ivHighDef;
	};

	this.redrawControls = function(){
//		this.sldrIVMax.drawSlider();
//		this.sldrIVMin.drawSlider();
		this.sldrNumberTrials.drawSlider();
		this.sldrPercentage.drawSlider();
	};

	/**
	 *This method sets up the web page area to get responses during the expeiment.
	 */
	this.setupRespArea = function(stimName){
		this.stimName = stimName;
		this.canvasResp = document.getElementById(this.idResp);  // grab the control area.

		// resize canvas so can create button.
		context = this.canvasResp.getContext("2d");
		resizeCanvas(this.canvasResp,context,def.defProWidthFull,0.25*def.defProHeightFull);

		// get the canvas width and height
		var width = this.canvasResp.width;
		var height = def.defFontSizePx*3;
		this.canvasResp.height = height;


		// create the yes button
		this.yesPos = [width/2-height*2,0,height*1.5,height*0.8];
		this.noPos = [width/2+height*0.5,0,height*1.5,height*0.8];

		this.yesButton = new Button(this.canvasResp,"Yes",this.yesPos[0],this.yesPos[1],this.yesPos[2],this.yesPos[3]);
		this.yesButton.setButtonColorSet(this.color1Norm,this.color2Norm,this.color1Over,this.color2Over);
		this.noButton = new Button(this.canvasResp,"No",this.noPos[0],this.noPos[1],this.noPos[2],this.noPos[3]);
		this.noButton.setButtonColorSet(this.color1Norm,this.color2Norm,this.color1Over,this.color2Over);

		// draw the response area for the first time
		this.drawRespArea();

		this.canvasResp.onmousedown = function(event){
            if (self.showResp === true) {
                var loc = new MouseLoc(event, self.canvasResp);
                // determine location of the mouse

                var x = loc.x;
                var y = loc.y;

                self.setRespCanvas(x, y);
            }
		};  // end mousedown on response canvas

		this.canvasResp.onmouseup = function(event){
			if (this.showResp === true){
				self.clearRespCanvas();
			}
		};
	};
	// feedback for  the buttons on the response canvas
	this.setRespCanvas = function(x,y){
//		alert("press down");
		if (this.yesButton.isClickOverButton(x,y) & this.yesButton.buttonDrawn){
//			alert("mouse is over button");
			this.yesButton.setButtonColors(this.yesButton.buttonPressed1,this.yesButton.buttonPressed2);
			this.yesButton.drawButton();
		}
		if (this.noButton.isClickOverButton(x,y) & this.noButton.buttonDrawn){
//			alert("mouse is over button");
			this.noButton.setButtonColors(this.noButton.buttonPressed1,this.noButton.buttonPressed2);
			this.noButton.drawButton();
		}
	};

	this.clearRespCanvas = function(){
		if (this.yesButton.buttonDrawn){  // only worry if the button has been drawn
//				alert("button mouseup");
			// redraw the button
			this.yesButton.setButtonColors(this.yesButton.buttonNorm1,this.yesButton.buttonNorm2);
			this.yesButton.drawButton();
		}
		if (this.noButton.buttonDrawn){  // only worry if the button has been drawn
//				alert("button mouseup");
			// redraw the button
			this.noButton.setButtonColors(this.noButton.buttonNorm1,this.noButton.buttonNorm2);
			this.noButton.drawButton();
		}
	};

	/**
	 *This method does the drawing function to draw the response area.
	 */
	this.drawRespArea = function(){
		context = this.canvasResp.getContext("2d");
		resizeCanvas(this.canvasResp,context,def.defProWidthFull,0.2*def.defProHeightFull);

		// get the canvas width and height
		var width = this.canvasResp.width;
		var height = def.defFontSizePx*3;
		this.canvasResp.height = height;

		// clear the response area
		context.fillStyle = def.defBackground;
		context.fillRect(0,0,this.canvasResp.width,this.canvasResp.height);

//alert("height = "+height+" "+window.innerHeight+"  "+0.2*def.defProHeightFull);
		// for the rest only draw if responses are visible
		if (this.showResp){
			// responses are visible
//			alert("responses are visible");
			// draw the yes button
			context.font = this.def.defFont;
			var s = this.question +"? ";
			var strLen = context.measureText(s).width;
			context.fillStyle = colorString(0,0,0);
			// set up the button areas
			this.yesPos = [width/2-height*2,0,height*1.5,height*0.8];
			this.noPos = [width/2+height*0.5,0,height*1.5,height*0.8];
			context.fillText(s,this.yesPos[0]-strLen-5,height/2);

			// reset the button dimensions if screen changes occurs
			this.yesButton.setButton(this.yesPos[0],this.yesPos[1],this.yesPos[2],this.yesPos[3]);
			this.noButton.setButton(this.noPos[0],this.noPos[1],this.noPos[2],this.noPos[3]);

			// set the button colors
			this.yesButton.drawButton();
			// set the button colors
			this.noButton.drawButton();
		}
	};

	/**
	 *This method sets or resets the experiment back to the beginning so it can be run.
	 * It does not reset to level to recollect parameter settings values
	 *
	 */
	this.initExp = function(){
		this.trial = 0;  // reset trials to beginning
		this.sigTrial = 0;  // reset the number of trials with signal
		this.percentSig = this.sldrPercentage.getValue();
		this.numTrials = this.sldrNumberTrials.getValue();
		this.numTrialsSig = Math.floor(this.numTrials*this.percentSig/100+0.5);  // number of trials in expeirment, rounded

		// reset the data arrays
		this.trialVals = [];	// the trial by trial data
		this.data = [];			// the data array.  It will have two dimensions
								// dimension 1 is the trial number and will be called rows
								// dimension 2 is the IV value(s) and DV Values and is referred to as columns
		this.trialData = [];	// a variable to hold the data for a given trial
		this.lastTrial = false;  // flag to indicate if the last trial has been executed
	};

	/**
	 *Begin trial method: determines the level of the method IV for the next trial
	 * to be passed to the stimulus object.
	 */
	this.getIV_Val = function(){
		if (this.trial === 0){
//			this.setupLevels();  // setup the levels of the IV from lowest to highest values
			// stimulus
		}
//alert("last trial in getIv_Val = "+this.lastTrial);
		if (this.lastTrial === false){
			// experiment is not done.
			this.curLevel = this.selectTrial();// randomly select a new level
			// now just work on steps to get the IV values for the next trial.
			return this.curLevel;
		}
		else {
			return true;
		}
	};

	this.collectData = function(resp){
//		alert("collecting response of "+resp+" curStair = "+this.curStair+" numSTair = "+this.numRepetitions);

		this.trialData = [];
		this.trialData[0] = this.trial+1;// normal people start counting with 1 not 0
		if (this.curLevel === true){
			this.trialData[1] = YES;  // the signal was present
		}
		else {
			this.trialData[1] = NO;// the signal was not present.
		}
//		this.trialData[1] = this.ivLevels[this.curLevel];  // first item is level of IV just presented
		this.trialData[2] = resp;  // what was the response
		// add to trial
		this.trialVals[this.trial] = this.trialData;  // add trial data to comprehensive data object

		// check the data collection
//alert("data values = " +this.trialVals[this.trial][0]+" "+this.trialVals[this.trial][1]+" "+this.trialVals[this.trial][2]);

		// check first for a cross-over
			// check to see if experiment is complete
		this.trial ++; // increase the trial counter
		if (this.trial >= this.numTrials){  // experiment is done
			this.lastTrial = true;
//alert("experiment is done"+" curStair = "+this.curStair+" numSTair = "+this.numRepetitions+" lastTrial = "+this.lastTrial);
		}

	};

	this.selectTrial = function(){
		var showSignal = false;

		// keep going until you pick a correct trial.
		var level = 100*Math.random();  // convert to percentage
		if (level < this.percentSig){
			showSignal = true;
		}

		if (showSignal === true){  // if select that a trial showu have a signal.
			if (this.sigTrial < this.numTrialsSig){    // have not reached the maximum number of trials with a signal
				this.sigTrial ++;
			}
			else {  // if the maximun number of trials with a signal have been reached, do not show the signal
				showSignal = false;
			}
		}
		else {  // trial has been selected to not have a signal.  Check the counting.
			if ((this.trial - this.sigTrial) < (this.numTrials-this.numTrialsSig)){
				//  you have not reached the maximun number of trials without a signal
				// don't need to do anything.  I write this only for clarity sake.
			}
			else {
				this.sigTrial ++;
				showSignal = true;
			}
		}

		return showSignal;
	};

	/**
	 * this method builds the scale of levels for the IV: either linear or logarithmic at this
	 * point in time.
	 */
	this.setupLevels = function(){
		// get the max and minimum values for the IV
//		this.ivMin = this.sldrIVMin.getValue();  // get the relevant values from the slider
//		this.ivMax = this.sldrIVMax.getValue();  // above is the min value this is the max value

		// now create a linear step array
//		if(this.ivLevelType == LINEAR){
//			var ivStep = (this.ivMax-this.ivMin)/(this.numIvLevels -1);

			// now create the steps.
//			this.ivLevels[0] = this.ivMin;
//			for (var i = 1; i < this.numIvLevels-1; i ++){
//				this.ivLevels[i] = this.ivLevels[i-1]+ivStep;  // add the step value to the last value of the series
//			}
//			this.ivLevels[this.numIvLevels-1] = this.ivMax;  // fix rounding errors

//		}
//		else if(this.ivLevelType == LOG){
//			// first convert the limit values to logarithms.
//			var logMin = Math.log(this.ivMin);
//			var logMax = Math.log(this.ivMax);
//
//			// get the steps, linear along this logarithmic scale.
//			var ivStep = (logMax-logMin)/(this.numIvLevels -1);
//
//			// now create the steps.  Still in the logarithmic Scale
//			this.ivLevels[0] = logMin;
//			for (var i = 1; i < this.numIvLevels; i ++){
//				this.ivLevels[i] = this.ivLevels[i-1]+ivStep;  // add the step value to the last value of the series
//			}
//			this.ivLevels[0] = this.ivMin;   // fix rounding errors
//			this.ivLevels[this.numIvLevels-1] = this.ivMax;
//
//			// Now convert the steps back to linear steps
//			for (var i = 0; i < this.numIvLevels; i ++){
//				this.ivLevels[i] = Math.exp(this.ivLevels[i]);  // add the step value to the last value of the series
//			}
//		}
	};

	this.reset = function(){
		// reset values only if experiment has not frozen values
//		if (this.sldrIVMax.doTrack)          { this.ivMax = this.ivMaxDflt;}
//		if (this.sldrIVMin.doTrack)          { this.ivMin = this.ivMinDflt; }
		if (this.sldrNumberTrials.doTrack)   { this.numTrials = this.numTrialsDflt; }
		if (this.sldrPercentage.doTrack)     { this.percentSig = this.percentageDflt; }

		// reset the sliders
//		this.sldrIVMax.setValue(this.ivMax);
//		this.sldrIVMin.setValue(this.ivMin);
		this.sldrNumberTrials.setValue(this.numTrials);
		this.sldrPercentage.setValue(this.percentSig);
	};

	//setters
	this.setMethodParams = function(methodParams){
		if (methodParams.length >= 1){
			this.expParam = methodParams;
			for (var i = 0; i < this.expParam.length; i ++){  // check out all the parameters
				if (i == this.SCALE){  // first parameter is what type of scale for the IV.
					this.ivLevelType = this.expParam[this.SCALE];
				}
				if (i == this.QUEST){
					// what is the question
					this.question = this.expParam[this.QUEST];
				}
				if (i == this.MOD_LEVEL){
					// what is the value for the modulus
					this.modValue = this.expParam[this.MOD_LEVEL];
				}
			}
		}
	};

	// freezes the stimulus parameters when the experiment has begun
	this.holdParam = function(b){
		if (b){ // true =  freeze the settings
			this.sldrNumberTrials.setDoTrack(false);  // number of levels in method of limits
			this.sldrPercentage.setDoTrack(false); // number of staircases
//			this.sldrIVMin.setDoTrack(false);
//			this.sldrIVMax.setDoTrack(false);
		}
		else { // false = allow the settings to move.
			this.sldrNumberTrials.setDoTrack(true);  // number of levels in method of limits
			this.sldrPercentage.setDoTrack(true); // number of staircases
//			this.sldrIVMin.setDoTrack(true);
//			this.sldrIVMax.setDoTrack(true);
		}
	};
	// set if responses should be visible or not
	this.setShowResp = function(b){
		if (b){
			this.showResp = true;
		}
		else {
			this.showResp = false;
		}
		this.drawRespArea();  // redraw the response area to indicate the current state.
	};

	/**
	 * If the participant is using key presses to respond
	 */
	this.getKeyResponse = function(unicode){
//alert("Key pressed during experiment is "+unicode);
		var resp = false;  // flag if there is not a response

		// was the yes key pressed
		var yResp = false;
		if (unicode == this.def.YES_KEY){
			yResp = true;
		}
		// was the no key responded to
		var nResp = false;
		if (unicode == this.def.NO_KEY){
			nResp = true;
		}
//		alert("yes button is pressed = "+yResp+"\no button is pressed = "+nResp);

		// if there is a valid response let the experiment know that and add the data
		if (yResp || nResp){
			this.setShowResp(false);// hide the response area so so extra responses are collected

			resp = true;  // there has been a valid response
			if (yResp) this.collectData(YES);
			if (nResp) this.collectData(NO);
			// go the method that collects the data into the data array
			// tracks progress and sets up values for next trial.
		}

		return resp;  // return the response to the experiment object
	};

	// getters
	this.getRespCanvas = function(){
		return this.canvasResp;
	};

	this.getShowResp = function(){  return this.showResp; };

	/**
	 *return the data formatted for plotting
	 */
	this.getData = function() {

		this.data = [];  // clear the data

		var jHappened = [];		// array to collect responses when participant judged a stimulus happened
								// this is the top row of the SDT data table
		var jNotHappened = [];	// array to collect respones when participant judged stimus not happend
								// this is the bottom row of the SDT data
		// initialize array counters
		jHappened[YES] = 0;
		jHappened[NO] = 0;
		jNotHappened[YES] = 0;
		jNotHappened[NO] = 0;

		for (var i = 0; i < this.trialVals.length; i ++){
			if (this.trialVals[i][2] === YES){  // the participant has judged that the signal has occured
				jHappened[this.trialVals[i][1]] ++;  // increase the counter for how often this occured on the rows.
			}
			else {		// the participant juded that the signal has not occurred
				jNotHappened[this.trialVals[i][1]] ++; //
			}
		}

		// convert to proportions
		jHappened[YES] = jHappened[YES]/this.sigTrial;		// hits
		jNotHappened[YES] = jNotHappened[YES]/this.sigTrial;// misses hits+misses = 1
		var nSigTrial = this.numTrials-this.sigTrial;		// number of trials without a signal
		jHappened[NO] = jHappened[NO]/nSigTrial;			// false alarms
		jNotHappened[NO] = jNotHappened[NO]/nSigTrial;		// correct rejections fa+cr = 1

		// put data in to data array for a table
		this.data[0] = jHappened;
		this.data[1] = jNotHappened;

		// debug: show all the trial data
		var s = "";
		for (i = 0; i < this.trialVals.length; i ++){
			for (var l = 0; l < this.trialVals[i].length; l ++){
				s += this.trialVals[i][l]+", ";
			}
			s += "\n";
		}
//		alert(s);

		// return the psychometric function
		return this.data;
//		return this.trialVals;
	};

	/**
	 *this method is called when the experiment object detects a click on the one
	 * the response canvas
	 */
	this.getResponse = function(x,y){  // x and y are the location of the click.
//		alert("seeing if there is a response x = "+x+" y = "+y);
		var resp = false;  // flag if there is not a response

		var yResp = this.yesButton.isClickOverButton(x,y);
		var nResp = this.noButton.isClickOverButton(x,y);

//		alert("yes button is pressed = "+yResp+"\no button is pressed = "+nResp);

		if (yResp || nResp){
			this.setShowResp(false);// hide the response area so so extra responses are collected

			resp = true;  // there has been a valid response
			if (yResp) this.collectData(YES);
			if (nResp) this.collectData(NO);
			// go the method that collects the data into the data array
			// tracks progress and sets up values for next trial.
		}

		return resp;  // return the response to the experiment object
	};

	this.updateResponse = function(unicode){
		if (unicode >= 48 & unicode <= 57){  // response between 0 & 9
			if (this.response.length < 6){
//alert("add a digit");
				this.response += unicode-48;  // add the digit
			}
		}
		if (unicode == 46){  // delete key
			this.response = "";
		}
		if (unicode == 8){  // back space
			if (this.response.length > 0){
				// there is something
				this.response = this.response.substring(0,this.response.length-1); // starts at 0
			}
		}
		this.drawRespArea();  // update the response area
	};

	/**
	 * The getResult method is the internal method that will calculate the threshold or PSE for the experiment
	 * and results objects
	 */
	this.getResult = function(){
		var result;

		if (this.lastTrial){
			normal = new NormalDistribution();  // create the normal distibution fuction

			// set the standard noise curve parameters
			normal.setMeanStdDev(3,1);

			// now find the criterion position that has the false alarms leve that has been computed
			var crit = 0;
			for (var i = 0; i < 10; i += 0.01){
				var z = normal.convertValToZ(i);
				if (normal.getAbove(z) >= this.data[0][1]){  // is the tail percentage larger than the false alarms
					crit = i;  // assign until smaller
				}
			}

			// now find the d' value
			var dPrime = 0;
			if (this.data[0][0] > this.data[0][1]){  // hits must be greater than false alarms
				for (d = 0; d < 10; d += 0.01){
					normal.mean = 3+d;  // reset mean in normal function
					var z = normal.convertValToZ(crit);
//alert("d = "+d+" crit = "+crit+" z = "+z+" above = "+normal.getAbove(z)+" hits = "+this.data[0][0]);
					if (normal.getAbove(z) <= this.data[0][0]){
						dPrime = d;
					}
				}
			}
// see what I have gotten
//alert("d' = "+dPrime+" crit = "+crit);
		}  // do the calculation to get the experimental result

		result = [dPrime,crit];

		return result;  // send the result to the experiment object.
	};

	this.getModulusText = function(){
		this.modulus = this.modText.value;
		return "This stimulus = "+this.modulus;
	};
}
