// the multiple dots drawing routine
function MovingDotsDraw(canvas) {
    this.canvas = canvas; //  the drawing canvas
    this.context = null; // drawing  context
    this.draw = null; // the drawing object
    this.def = new Defaults(); // the system defaults.
    this.outsideCanvasHeight = 0; // the size of the response canvas to take into account

    this.foreground = colorString(100, 255, 100); // color of the stimuli
    // the foreground color is the color of these dots
    this.outline = colorString(225, 225, 50); // outline of the viewing area
    this.backVal = 175; // intensity of background
    this.background = colorString(this.backVal, this.backVal, this.backVal);
    this.stimDotColor = colorString(255, 255, 0);

    // stimulus control parameters
    this.showStim = true;
    this.showModulus = false;

    // stimulus parameters
    this.numStimDots = 1; // number of dots that make up the stimulus
    this.showStimDots = true; // if the stimulus is shown, is the stimulus dots as well shown
    this.numBackDots = 25; // number of dots in the background
    this.dotDiam = 4; // the diameters of the dots
    this.max = 100; // max range of number of dots
    this.min = 0; // min range of number of dots
    this.backDotsSpeed = 5; // distance in pixels the dot will move between updates
    this.stimDotsSpeed = 6; // distance the stimulus dots will move between updates.
    this.dotDir = []; //  array of dot directions
    this.stimDotDir = []; // array of stimulus directions
    this.dotPos = []; //	array of current dot positions
    this.stimDotPos = []; // position of stimulus dots
    this.angleVar = 30; //	variation allowed angle

    // temporary parameters as convert to new stimulus
    this.dotLum = 50; // the lum value of all three guns

    // positions determined randomly around edge, as is direction of motion
    // motion parameters and objects
    this.update = null; // time for updating the moving dots.
    this.startStim = true; // is this the beginning of the stimulus Dots go to beginning positions

    // bind object
    var self = this;

    this.initStim = function(canvas) { // initial the stimulus objects
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.draw = new Draw(this.canvas);
    };

    this.drawStim = function() {
        this.context = this.canvas.getContext("2d");
        this.draw = new Draw(this.canvas);

        // get the canvas size into variables
        var width = canvas.width; // width of canvas
        var height = canvas.height; // height of column in pixels

        // clear canvas
        this.background = colorString(this.backVal, this.backVal, this.backVal);
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, width, height);

        // draw the fixation mark which stays on the entire time.
        this.draw.setStrokeWidth(3);
        var yCtr = height / 2;
        var xCtr = width / 2;
        //		var fRad = height/30;
        // clear canvas
        this.context.fillStyle = this.def.defBackground;
        this.context.fillRect(0, 0, width, height);

        // draw the circle
        var diam = width; // diameter in circle
        if (width > height) {
            diam = height;
        } // chose the smaller dimensions

        // fill the drawing circle background
        this.context.fillStyle = this.background;
        this.draw.circle(xCtr, yCtr, diam / 2);
        this.context.fill();
        // outline the circle
        this.context.lineWidth = 3;
        this.context.strokeStyle = this.outline;
        this.context.stroke();

        // draw the dots
        if (this.showStim) {
            // now draw the dot.
            if (this.forcedChoice & this.typeForcedChoice == this.SPATIAL) {
                // how to handle forced choice information
            }


            // draw the background dots
            // set the drawing style
            this.context.fillStyle = this.foreground;

            // if this the beginning of a new stimulus session, create the dots
            if (this.startStim) {
                this.createStim(diam, xCtr, yCtr);
            } else {
                this.moveDots();
            }

            // draw the background dots
            for (var i = 0; i < this.numBackDots; i++) {
                // create a circle NEED TO ADD ABILITY TO ALSO DRAW SQUARES
                var x = this.dotPos[i][0]; // check dot distance
                var y = this.dotPos[i][1];
                if (Math.sqrt((x - xCtr) * (x - xCtr) + (y - yCtr) * (y - yCtr)) < (diam / 2 - this.dotDiam)) {
                    this.draw.circle(this.dotPos[i][0], this.dotPos[i][1], this.dotDiam);
                    this.context.fill();
                }
            }

            // draw the stimulus
            if (this.showStimDots === true) {
                for (var i = 0; i < this.numStimDots; i++) {
                    // create a circle NEED TO ADD ABILITY TO ALSO DRAW SQUARES
                    var x = this.stimDotPos[i][0]; // check dot distance
                    var y = this.stimDotPos[i][1];
                    if (Math.sqrt((x - xCtr) * (x - xCtr) + (y - yCtr) * (y - yCtr)) < (diam / 2 - this.dotDiam)) {
                        this.draw.circle(this.stimDotPos[i][0], this.stimDotPos[i][1], this.dotDiam);
                        this.context.fillStyle = this.stimDotColor;
                        this.context.fill();
                    }
                }
            }

            if (this.showModulus) {
                //				alert("drawing modulus text");
                // draw the text for the modulus question
                this.context.fillStyle = colorString(0, 0, 0);
                this.context.font = this.def.defFont18;
                this.context.textAlign = "center";
                this.context.fillText(this.modText, width / 2, height / 2 + 50);
            } // end if showmodulus

            // outline the circle
            this.context.lineWidth = 3;
            this.context.strokeStyle = this.outline;
            this.draw.circle(xCtr, yCtr, diam / 2);
            this.context.stroke();

            this.startStim = false;
        } // end if this showstim

    }; // end drawstim

    this.createStim = function(diam, xCtr, yCtr) { // pass along the diameter of the circle
        // first create the background stimuli
        //alert("create stim");
        for (var i = 0; i < this.numBackDots; i++) {
            // choose an angle for the edge of the circle
            var angle = 360.0 * Math.random();

            this.dotDir[i] =
                angle + (2 * this.angleVar * (Math.random() - 0.5)) - 180; // direction of motion, opposite of entry +- area.

            // put the dot on the edge of the circle
            var curDot = this.draw.circleAnglePoint(angle, diam - this.dotDiam, xCtr, yCtr);
            this.dotPos[i] = [];
            this.dotPos[i] = curDot;
        }

        // now create the target stimuli
        for (i = 0; i < this.numStimDots; i++) {
            // choose an angle for the edge of the circle
            var angle = 360.0 * Math.random();

            this.stimDotDir[i] =
                angle + (2 * this.angleVar * (Math.random() - 0.5)) - 180; // direction of motion, opposite of entry +- area.

            // put the dot on the edge of the circle
            var curDot = this.draw.circleAnglePoint(angle, diam - this.dotDiam, xCtr, yCtr);
            this.stimDotPos[i] = [];
            this.stimDotPos[i] = curDot;
        }
    } // end create stim

    // this method moves the dots to a new position
    this.moveDots = function() {
        // first move the background dots
        for (var i = 0; i < this.numBackDots; i++) {
            this.dotPos[i] = this.draw.circleAnglePoint(this.dotDir[i], this.backDotsSpeed,
                this.dotPos[i][0], this.dotPos[i][1]);
        }

        // now move the stimulus dots
        for (i = 0; i < this.numStimDots; i++) {
            this.stimDotPos[i] = this.draw.circleAnglePoint(this.stimDotDir[i], this.stimDotsSpeed,
                this.stimDotPos[i][0], this.stimDotPos[i][1]);
        }
    }

    // methods to start and stop the motion of the dots
    this.start = function() { // start the dots moving
        this.update = setInterval(function() { // use anonymous inner function since in side of an object
            self.drawStim();
        }, 50); // set update rate to each fram is 50 ms apart.
    }

    this.stop = function() { //  stop the animation moving
        clearInterval(self.update); // clears the interval listening.
        self.startStim = true; // set so next time draw a new stimulus will be created.
    }
} // end the stimulus draw object.

// illustration object to display multiple dots
function MovingDots(canvasId) {
    // the context object
    this.canvas = document.getElementById(canvasId);

    this.adjustSize = true; // allow canvas to be sensitive to proportions of screen

    // the actual stimulus
    this.stimulus = new MultipleDotsDraw(this.canvas);

    this.numDots = this.stimulus.numBackDots; // the number of dots
    this.scaleM = 1;
    this.scaleB = 0;

    this.init = function() {
        if (this.canvas !== null) {
            this.stimulus.initStim(this.canvas);

        }
    };

    this.drawResults = function() {
        if (this.adjustSize) { // check for screen size changes
            setOutsideHeight(this.outsideCanvasHeight);
            resizeCanvas(canvas, this.context, this.def.defProWidthFull, this.def.defProHeightFull);
        } else if (this.roomControls === true) { // if controls, reduce overall canvas
            if (window.innerWidth > window.innerHeight) { // for wide browsers reduce width
                resizeCanvas(this.graphArea, this.context, this.def.defProWidthConW, 0.8 * this.def.defProHeightFull);
            } else { // if browser window is tall
                resizeCanvas(this.graphArea, this.context, this.def.defProWidthFull, 0.8 * this.def.defProWidthConH);
            }
        }
        this.stimulus.numBackDots = this.numDots;
        this.stimulus.drawStim(); // draw the stimulus
    };

    // getters and setters
    // setters
    // set the DOM objects
    this.setDOMObjects = function(canvasId) {
        this.canvas = document.getElementById(canvasId); // drawing canvas
        this.init();
    };
    // set the canvas size.
    this.setSize = function(canvasWidth, canvasHeight) {
        this.adjustSize = false;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
    };

    this.setSpecialParameters = function(specialParameters) {
        // how to handle the special parameters to alter the illustration in this case
        if (specialParameters instanceof xySpecialParam) {
            if (specialParameters.typeExtra == X_VAL) {
                this.numDots = specialParameters.extraParam;
                this.numDots = this.scaleM * this.numDots + this.scaleB;
            }
        } // if just one special parameter is passed
        else if (specialParameters === null) {
            // capture null data.
        } else if (specialParameters.length >= 1) { // is an array of special parameters passed
            for (var i = 0; i < specialParameters.length; i++) {
                // now check each special parameter
                if (specialParameters[i] instanceof xySpecialParam) {
                    if (specialParameters[i].typeExtra == X_VAL) {
                        this.numDots = specialParameters[i].extraParam;
                        //alert("xVal = "+this.xValShow);
                    }
                    if (specialParameters[i].typeExtra == X_SCALE) {
                        var max = specialParameters[i].extraParam[0];
                        var min = specialParameters[i].extraParam[1];
                        this.scaleM = (this.stimulus.max - this.stimulus.min) / (max - min);
                        this.scaleB = this.stimulus.min - min;
                        //alert("slope = "+this.scaleM+"   intercept = "+this.scaleB);
                    }
                }
                // convert the number of dots
            } // end going through array
            this.numDots = this.scaleM * this.numDots + this.scaleB;
            //alert("number dots = "+this.numDots);
        } // end checking for array of special parameters
    };

    this.setSetupParam = function(param) {
        // empty method as there are no setup parameters to be set at this time.
    };
}

function MovingDotsExp(idSetup, idCanvas) {
    //	alert("in dotThreshold");
    this.doSetup = false; // flag to indicate if do the setup of the stimulus
    this.idSetup = idSetup; // the paragraph for the stimulus setup
    this.setupPage = null; // the object of the document where to put the stimulus parameters
    this.idCanvas = idCanvas; // the canvas where the stimulus is to be presented
    this.canvas = document.getElementById(this.idCanvas);
    this.def = new Defaults();
    this.draw = new Draw(this.canvas);

    // allow canvas size to adjust
    this.adjustSize = true;

    // experiment related parameters
    this.showStartup = false; // if this object is being run in an experiment, then
    // there needs to be a screen to show before the experiment begins
    this.startScreen = new StartScreen();
    this.BUTTON_X = this.startScreen.BUTTON_X;
    this.BUTTON_Y = this.startScreen.BUTTON_Y;
    this.BUTTON_W = this.startScreen.BUTTON_W;
    this.BUTTON_H = this.startScreen.BUTTON_H;
    this.showClear = false; // draw a blank screen and tell user that experiment is over.

    // parameters of the dot stimulus and screen
    this.numBackDotsDflt = 25; // number of background dots
    this.numBackDots = this.numBackDotsDflt;
    this.numStimDotsDflt = 1; // number of stimulus dots
    this.numStimDots = this.numStimDotsDflt;
    this.backSpeedDflt = 5; // distance in pixels the dot will move between updates
    this.backSpeed = this.backSpeedDflt;
    this.stimSpeedDflt = 1; // distance the stimulus dots will move between updates.
    this.stimSpeed = this.stimSpeedDflt;
    this.stimColorDflt = colorString(100, 255, 100); // color of the stimulus dots, default is the same as background dots
    this.stimColor = colorString(100, 255, 100);
    this.backValDflt = 25; // intensity of the background
    this.backVal = this.backValDflt;
    this.background = colorString(this.backVal, this.backVal, this.backVal);
    this.dotDiamDflt = 4; // diameter of the dots in pixels.
    this.dotDiam = this.dotDiamDflt;
    this.stimDurDflt = 2000 // duration of the stimulus motion
    this.stimDur = this.stimDurDflt;

    // parameters to adjust the stimulus
    this.STIM_NAME = "speed"; // variable to hold the name of the stimulus
    this.numBackDotsLabel = "Number of Background Dots";
    this.sldrNumBackDots = null;
    this.numStimDotsLabel = "Number of Stimulus Dots";
    this.sldrNumStimDots = null;
    this.backSpeedLabel = "Speed of Background Dots (pixels)";
    this.sldrBackSpeed = null;
    this.stimSpeedLabel = "Relative Speed of Stimulus (pixels)";
    this.sldrStimSpeed = null;
    this.stimColorLabel = "Color of Stimulus Dots";
    this.sldrStimColor = null;
    this.dotSizeLabel = "Dot Diameter (pixels)";
    this.sldrDotSize = null;
    this.backValLabel = "Background Level (display values)";
    this.sldrBackVal = null;
    this.stimDurLabel = "Duration of Stimulus (sec)";
    this.sldrStimDur = null;

    // which settings variables to show
    this.showSldrNumBackDots = true;
    this.showSldrNumStimDots = true;
    this.showSldrBackSpeed = true;
    this.showSldrStimSpeed = true;
    this.showSldrStimColor = true;
    this.showSldrDotSize = true;
    this.showSldrBackVal = true;
    this.showSldrStimDur = true;

    // variables that can be manipulated
    this.VARIABLES = [this.numBackDotsLabel, this.numStimDotsLabel, this.backSpeedLabel, this.stimSpeedLabel,
        this.stimColorLabel, this.dotSizeLabel, this.backValLabel
    ];
    this.NUM_BACK = 0; // indexes of the variables
    this.NUM_STIM = 1;
    this.BACK_SPEED = 2;
    this.STIM_SPEED = 3;
    this.STIM_COLOR = 4;
    this.SIZE = 5;
    this.BACK = 6;
    this.STIM_DUR = 7;

    // trial parameters: must be present
    this.trialRun = false; // is the stimulus in a trial
    this.trialDelay = 500; // delay from start of trial to beginning of stimulus in msec
    this.showStim = true; // flag to indicate if the target stimulus is to be shown.
    // trial timers
    this.timerDelay = null; // timer for delay from beginning of trial to beginning of dot
    this.timerFlash = null; // timer that time the duration of the dot flash.
    this.forcedChoice = false; // flag to indicate if a forced choice method is being used by the experiment.
    this.SPATIAL = 0;
    this.TEMPORAL = 1;
    this.typeForcedChoice = this.SPATIAL;
    this.fcParam = 0; // the parameter that indicates position or time of stimulus in forced choice exp.
    // object to say that data can be collected
    this.useModulus = false; // magnitude estimation criteria
    this.showModulus = false;
    this.modText = "";
    this.modVal = null; // holding variables for the modulus and IV values
    this.ivVal = null;
    this.ivIndex = null; // the IV bing manipulated in this experiment

    this.movingDots = new MovingDotsDraw(this.canvas);

    // flag to indicate trial is done
    this.collectData = false;

    // bind the object to itself
    var self = this;

    this.drawStim = function(canvas) {
        //alert("drawStim");
        // get the drawing context
        this.context = canvas.getContext("2d");

        if (this.adjustSize) { // check for screen size changes
            resizeCanvas(canvas, this.context, this.def.defProWidthFull, 0.8 * this.def.defProHeightFull);
        }

        if (this.showStartup) { // draw the startup screen
            this.startScreen = new StartScreen();
            this.startScreen.drawStartScreen(canvas, this.context);
        } else if (this.showClear) { // do the done experiment screen
            this.startScreen.drawClearScreen(canvas, this.context);
        } else {
            // draw the regular stimulus screen.
            // first collect the current parameters of the dot if in an experiment with a setup window
            if (this.doSetup) {
                if (this.showSldrNumBackDots) {
                    this.numBackDots = this.sldrNumBackDots.getValue();
                }
                if (this.showSldrNumStimDots) {
                    this.numStimDots = this.sldrNumStimDots.getValue();
                }
                if (this.showSldrBackSpeed) {
                    this.backSpeed = this.sldrBackSpeed.getValue();
                }
                if (this.showSldrStimSpeed) {
                    this.stimSpeed = this.sldrStimSpeed.getValue();
                }
                if (this.showSldrStimColor) {
                    this.stimColor = this.sldrStimColor.getColor();
                }
                if (this.showSldrDotSize) {
                    this.dotDiam = this.sldrDotSize.getValue();
                }
                if (this.showSldrBackVal) {
                    this.backVal = this.sldrBackVal.getValue();
                }
                if (this.showSldrStimDur) {
                    this.stimDur = this.sldrStimDur.getValue() * 1000;
                }
            }
            // pass parameters to stimulus drawing object
            this.movingDots.numBackDots = this.numBackDots;
            this.movingDots.numStimDots = this.numStimDots;
            this.movingDots.backDotsSpeed = this.backSpeed;
            this.movingDots.stimDotsSpeed = this.backSpeed + this.stimSpeed; // make the stimulus speed always faster
            this.movingDots.stimDotColor = this.stimColor;
            this.movingDots.dotDiam = this.dotDiam;
            this.movingDots.backVal = this.backVal;
            this.movingDots.showStim = this.showStim;
            this.movingDots.showStimDots = this.showStimDots;
            this.movingDots.showModulus = this.showModulus;

            this.movingDots.drawStim();
        }
    };

    // external redraw functions
    this.redraw = function() {
        this.drawStim(this.canvas);
    };

    // check for external click
    this.checkClick = function(x, y) {
        // nothing happens for this stimulus
    };

    this.doVariableSetup = function() {
        this.doSetup = true; // if this function is called, we are doing a sitmulus setup
        setupPage = document.getElementById(idSetup);
        var innerHTML = "";
        // ad the elements allowed
        if (this.showSldrNumBackDots) {
            innerHTML += "<canvas id='numBackDots'> </canvas><br>";
        }
        if (this.showSldrNumStimDots) {
            innerHTML += "<canvas id='numStimDots'> </canvas><br>";
        }
        if (this.showSldrBackSpeed) {
            innerHTML += "<canvas id='backSpeed'> </canvas><br>";
        }
        if (this.showSldrStimSpeed) {
            innerHTML += "<canvas id='stimSpeed'> </canvas><br>";
        }
        if (this.showSldrStimColor) {
            innerHTML += "<p id='stimColor'> </p>";
        }
        if (this.showSldrDotSize) {
            innerHTML += "<canvas id='dotSize'> </canvas><br>";
        }
        if (this.showSldrBackVal) {
            innerHTML += "<canvas id='backVal'> </canvas><br>";
        }
        if (this.showSldrStimDur) {
            innerHTML += "<canvas id='stimDur'> </canvas><br>";
        }
        setupPage.innerHTML = innerHTML;

        // now set up the controls but only those allowed
        if (this.showSldrNumBackDots) {
            this.sldrNumBackDots = new Slider(this.numBackDotsLabel, numBackDots, 75);
            this.sldrNumBackDots.setSliderStep(1);
            this.sldrNumBackDots.setRange(1, 100);
            this.sldrNumBackDots.setShowMaxMin(true);
            this.sldrNumBackDots.setValue(this.numBackDots);
        }
        if (this.showSldrNumStimDots) {
            this.sldrNumStimDots = new Slider(this.numStimDotsLabel, numStimDots, 75);
            this.sldrNumStimDots.setSliderStep(1);
            this.sldrNumStimDots.setRange(1, 100);
            this.sldrNumStimDots.setShowMaxMin(true);
            this.sldrNumStimDots.setValue(this.numStimDots);
        }
        if (this.showSldrBackSpeed) {
            this.sldrBackSpeed = new Slider(this.backSpeedLabel, backSpeed, 75);
            this.sldrBackSpeed.setSliderStep(1);
            this.sldrBackSpeed.setRange(1, 10);
            this.sldrBackSpeed.setShowMaxMin(true);
            this.sldrBackSpeed.setValue(this.backSpeed);
        }
        if (this.showSldrStimSpeed) {
            this.sldrStimSpeed = new Slider(this.stimSpeedLabel, stimSpeed, 75);
            this.sldrStimSpeed.setSliderStep(0.1);
            this.sldrStimSpeed.setRange(1, 10);
            this.sldrStimSpeed.setShowMaxMin(true);
            this.sldrStimSpeed.setValue(this.stimSpeed);
        }
        if (this.showSldrStimColor) {
            cV = colorVal(this.stimColor); // convert the color string back to numeric values
            this.sldrStimColor = new ColorSlider("Stimulus Color", cV[0], cV[1], cV[2], stimColor, [true, false, false]);
            this.sldrStimColor.setShowValue(false);
            this.sldrStimColor.setShowButton(false);
            this.sldrStimColor.setShowColor(true);
            this.sldrStimColor.setShowMaxMin(false);
            this.sldrStimColor.drawSlider();
        }
        if (this.showSldrDotSize) {
            this.sldrDotSize = null;
            this.sldrDotSize = new Slider(this.dotSizeLabel, dotSize, 75);
            this.sldrDotSize.setSliderStep(1);
            this.sldrDotSize.setRange(1, 20);
            this.sldrDotSize.setShowMaxMin(true);
            this.sldrDotSize.setValue(this.dotDiam);
        }
        if (this.showSldrBackVal) {
            this.sldrBackVal = new Slider(this.backValLabel, backVal, 75);
            this.sldrBackVal.setSliderStep(5);
            this.sldrBackVal.setRange(0, 200);
            this.sldrBackVal.setShowMaxMin(true);
            this.sldrBackVal.setValue(this.backVal);
        }
        if (this.showSldrStimDur) {
            this.sldrStimDur = new Slider(this.stimDurLabel, stimDur, 75);
            this.sldrStimDur.setSliderStep(0.1);
            this.sldrStimDur.setRange(1, 10);
            this.sldrStimDur.setShowMaxMin(true);
            this.sldrStimDur.setValue(this.stimDur / 1000);
        }
    };

    this.redrawControls = function() {
        if (this.showSldrNumBackDots) {
            this.sldrNumBackDots.drawSlider();
        }
        if (this.showSldrNumStimDots) {
            this.sldrNumStimDots.drawSlider();
        }
        if (this.showSldrBackSpeed) {
            this.sldrBackSpeed.drawSlider();
        }
        if (this.showSldrStimSpeed) {
            this.sldrStimSpeed.drawSlider();
        }
        if (this.showSldrStimColor) {
            this.sldrStimColor.drawSlider();
        }
        if (this.showSldrBackVal) {
            this.sldrBackVal.drawSlider();
        }
        if (this.showSldrDotSize) {
            this.sldrDotSize.drawSlider();
        }
        if (this.showSldrStimDur) {
            this.sldrStimDur.drawSlider();
        }
    };

    // trial methods
    this.startTrial = function() {
        // begin the sequence of events for a trial on the stimulus side.
        this.trialRun = true;
        this.showStim = false;
        this.collectData = false; // allow data to be collected.
        this.drawStim(this.canvas);
        //		alert("starting trial "+this.trialDelay);
        // start the timer, use an anonymous inner function because in an object.
        if (this.useModulus) {
            this.timerDelay = setInterval(function() {
                self.flashModulus(); // flash the modulus on and off
            }, this.trialDelay);
        } else {
            this.timerDelay = setInterval(function() {
                //			alert("timer has gone off");
                self.flashStim();
            }, this.trialDelay);
        }
        //		alert("delay started");
    };

    // create and dispatch a custom event that the stimulus is ready
    this.eventDataReady = function() {
        // create an event
        this.stimEvent = new CustomEvent(
            "collectData", {
                detail: {
                    message: "Data Ready to Collect",
                    ready: self.collectData,
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        this.canvas.dispatchEvent(this.stimEvent); // dispatch event the stimulus has been drawn
    }

    // handle the events after the delay
    this.flashStim = function() {
        clearInterval(this.timerDelay); // stop the delay repeating itself
        this.showStim = true;
        this.drawStim(this.canvas);
        this.movingDots.start(); // start the motion of the dots

        if (this.stimDur > 0) {
            this.timerFlash = setInterval(function() {
                //				alert("turn off stimulus");
                self.clearStim();
            }, this.stimDur);
        } else {
            // if leave stimulus on, signal end of presentation and data can be collected
            this.collectData = true;
            this.eventDataReady();
        }
    };

    this.clearStim = function() {
        //		alert("removing stimulus");
        clearInterval(this.timerFlash);
        this.movingDots.stop();
        this.trialRun = false;
        this.showStim = false;
        this.collectData = true; // allow data to be collected.
        this.eventDataReady();
        this.drawStim(this.canvas);
    };

    this.flashModulus = function() {
        clearInterval(this.timerDelay);
        //		if (this.ivIndex == this.SIZE){
        //			this.dotDiam = this.modVal;
        //		}
        //		else if (this.ivIndex == this.POS){
        //			this.dotPos = this.modVal;
        //		}
        //		else if (this.ivIndex == this.LUM){
        //			this.dotLum = this.modVal;
        //		}
        //		else if (this.ivIndex == this.BACK) {
        //			this.backVal = this.modVal;
        //		}
        this.showModulus = true;
        this.showStim = true;
        this.drawStim(this.canvas);
        this.movingDots.start(); // start the motion of the dots

        this.timerFlash = setInterval(function() {
            //				alert("turn off stimulus");
            self.clearMod();
        }, this.stimDur);
    };
    // clear the modulus
    this.clearMod = function() {
        //		alert("removing modulus");
        clearInterval(this.timerFlash);
        this.movingDots.stop(); // stop the motion of the dots.
        this.showStim = false;
        this.showModulus = false;
        this.drawStim(this.canvas);
        //		if (this.ivIndex == this.SIZE){
        //			this.dotDiam = this.ivVal;
        //		}
        //		else if (this.ivIndex == this.POS){
        //			this.dotPos = this.ivVal;
        //		}
        //		else if (this.ivIndex == this.LUM){
        //			this.dotLum = this.ivVal;
        //		}
        //		else if (this.ivIndex == this.BACK) {
        //			this.backVal = this.ivVal;
        //		}
        this.timerDelay = setInterval(function() {
            //			alert("timer has gone off");
            self.flashStim();
        }, this.trialDelay);
    };

    // restore stimulus values to defaults and reset the experiment
    // but only if experiment has not frozen values.
    this.reset = function() {
        if (this.showSldrNumBackDots) {
            if (this.sldrNumBackDots.doTrack) {
                this.numBackDots = this.numBackDotsDflt;
                this.sldrNumBackDots.setValue(this.numBackDots);
            }
        }
        if (this.showSldrNumStimDots) {
            if (this.sldrNumStimDots.doTrack) {
                this.numStimDots = this.numStimDotsDflt;
                this.sldrNumStimDots.setValue(this.numStimDots);
            }
        }
        if (this.showSldrBackSpeed) {
            if (this.sldrBackSpeed.doTrack) {
                this.numBackSpeed = this.numBackSpeedDflt;
                this.sldrBackSpeed.setValue(this.backSpeed);
            }
        }
        if (this.showSldrStimSpeed) {
            if (this.sldrStimSpeed.doTrack) {
                this.numStimSpeed = this.numStimSpeedDflt;
                this.sldrStimSpeed.setValue(this.stimSpeed);
            }
        }
        if (this.showSldrStimColor) {
            if (this.sldrStimColor.doTrack) {
                var cV = colorVal(this.stimColorDflt);
                this.sldrStimColor.setValue(cV);
            }
        }
        if (this.showSldrDotSize) {
            if (this.sldrDotSize.doTrack) {
                this.dotDiam = this.dotDiamDflt;
                this.sldrDotSize.setValue(this.dotDiam);
            }
        }
        if (this.showSldrBackVal) {
            if (this.sldrBackVal.doTrack) {
                this.backVal = this.backValDflt;
                this.sldrBackVal.setValue(this.backVal);
            }
        }
        if (this.showSldrStimDur) {
            if (this.sldrStimDur.doTrack) {
                this.numStimDur = this.numStimDurDflt;
                this.sldrStimDur.setValue(this.stimDur / 1000);
            }
        }
    };

    // getters and setters
    // setters
    /**
     * sets the level of the IV for the experiment
     * ivIndex indicates which variable of the stimulus is being manipulated (in the expParam object)
     * ivVal is the level of this IV
     */
    this.setStimLevel = function(ivIndex, ivVal) {
        this.ivVal = ivVal;
        this.ivIndex = ivIndex;
        if (ivIndex == -1) { // a signal detection experiment
            this.showStimDots = ivVal;
        }
        //		if (ivIndex == this.SIZE){
        //			this.dotDiam = ivVal;
        //		}
        //		else if (ivIndex == this.POS){
        //			this.dotPos = ivVal;
        //		}
        //		else if (ivIndex == this.LUM){
        //			this.dotLum = ivVal;
        //		}
        //		else if (ivIndex == this.BACK) {
        //			this.backVal = ivVal;
        //		}
    };

    // sets the level of the modulus so that it can be used in a magnitude estimation experiment.
    this.setModulusValue = function(modVal) {
        this.modVal = modVal;
    };

    // determines if the startup screen will be draw.  Does not do an automatic redraw.
    this.setShowStartup = function(b) {
        if (b) {
            this.showStartup = true;
            this.showClear = false;
        } else {
            this.showStartup = false;
            this.showClear = false;
            this.startScreen.clearButton();
        }
    };

    this.setShowStim = function(b) {
        // indicate if stimulus is to be shown
        if (b) {
            this.showStim = true;
        } else {
            this.showStim = false;
        }
    };

    // freezes the stimulus parameters when the experiment has begun
    this.holdParam = function(b) {
        if (this.doSetup) { // only worry if setup is engaged
            if (b) { // true  so pause slider tracking
                if (this.showSldrNumBackDots) {
                    this.sldrNumBackDots.setDoTrack(false);
                }
                if (this.showSldrNumStimDots) {
                    this.sldrNumStimDots.setDoTrack(false);
                }
                if (this.showSldrBackSpeed) {
                    this.sldrBackSpeed.setDoTrack(false);
                }
                if (this.showSldrStimSpeed) {
                    this.sldrStimSpeed.setDoTrack(false);
                }
                if (this.showSldrStimColor) {
                    this.sldrStimColor.setDoTrack(false);
                }
                if (this.showSldrDotSize) {
                    this.sldrDotSize.setDoTrack(false);
                }
                if (this.showSldrBackVal) {
                    this.sldrBackVal.setDoTrack(false);
                }
                if (this.showSldrStimDur) {
                    this.sldrStimDur.setDoTrack(false);
                }
            } else { // false so restart slider tracking
                if (this.showSldrNumBackDots) {
                    this.sldrNumBackDots.setDoTrack(true);
                }
                if (this.showSldrNumStimDots) {
                    this.sldrNumStimDots.setDoTrack(true);
                }
                if (this.showSldrBackSpeed) {
                    this.sldrBackSpeed.setDoTrack(true);
                }
                if (this.showSldrStimSpeed) {
                    this.sldrStimSpeed.setDoTrack(true);
                }
                if (this.showSldrStimColor) {
                    this.sldrStimColor.setDoTrack(true);
                }
                if (this.showSldrDotSize) {
                    this.sldrDotSize.setDoTrack(true);
                }
                if (this.showSldrBackVal) {
                    this.sldrBackVal.setDoTrack(true);
                }
                if (this.showSldrStimDur) {
                    this.sldrStimDur.setDoTrack(true);
                }
            }
        }

    };

    this.setVariablesShow = function(varToShow) {
        this.doSetup = true;
        // check the indexes
        if (varToShow[this.NUM_BACK]) {
            this.showSldrNumBackDots = true;
        } else {
            this.showSldrNumBackDots = false;
        }
        if (varToShow[this.NUM_STIM]) {
            this.showSldrNumStimDots = true;
        } else {
            this.showSldrNumStimDots = false;
        }
        if (varToShow[this.BACK_SPEED]) {
            this.showSldrBackSpeed = true;
        } else {
            this.showSldrBackSpeed = false;
        }
        if (varToShow[this.STIM_SPEED]) {
            this.showSldrStimSpeed = true;
        } else {
            this.showSldrStimSpeed = false;
        }
        if (varToShow[this.STIM_COLOR]) {
            this.showSldrStimColor = true;
        } else {
            this.showSldrStimColor = false;
        }
        if (varToShow[this.SIZE]) {
            this.showSldrDotSize = true;
        } else {
            this.showSldrDotSize = false;
        }
        if (varToShow[this.BACK]) {
            this.showSldrBackVal = true;
        } else {
            this.showSldrBackVal = false;
        }
        if (varToShow[this.STIM_DUR]) {
            this.showSldrStimDur = true;
        } else {
            this.showSldrStimDur = false;
        }
        this.doVariableSetup();
    };

    // if needed
    this.setStimParam = function(stimParam) {
        if (stimParam.length >= 1) {
            //			this.stimDur = stimParam[0];
        }
    };

    // getters
    /**
     *for the experiment method, get the current iv value
     */
    this.getIvVal = function(ivIndex) {
        //this.SIZE = 0;  // indexes of the variables
        //this.POS  = 1;
        //this.LUM  = 2;
        //this.BACK = 3;
        var ivVal = false; // default value
        //		if (ivIndex == this.SIZE){
        //			ivVal = this.dotDiam;
        //		}
        //		else if (ivIndex == this.BACK) {
        //			ivVal = this.backVal;
        //		}

        return ivVal; // return the value to the experiment object that is being used for this experiment
    };

    // get the canvas
    this.getCanvas = function() {
        return this.canvas;
    };
    // get the position and dimensions of start button
    this.getStartButton = function() {
        return this.startScreen.getButton();
    };

    // status methods
    this.isStartButtonClicked = function(x, y) {
        var isClicked = this.startScreen.isStartButtonClicked(x, y);
        return isClicked;
    };
}